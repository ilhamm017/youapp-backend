import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { ViewMessagesDto } from './dto/view-messages.dto';
import { RabbitMQService } from './services/rabbitmq.service';
import { MessageQueue } from '../shared/data-structures/queue';
import { MessageTree } from '../shared/data-structures/binary-tree';
import { UserGraph } from '../shared/data-structures/graph';

@Injectable()
export class ChatService {
    private unreadMessagesQueue: MessageQueue<any>;
    private messageTree: MessageTree<any>;
    private userGraph: UserGraph<string>;

    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        private rabbitMQService: RabbitMQService,
    ) {
        // Initialize custom data structures
        this.unreadMessagesQueue = new MessageQueue<any>(1000);
        this.messageTree = new MessageTree<any>((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return timeA - timeB;
        });
        this.userGraph = new UserGraph<string>(false); // undirected graph for user relationships
    }

    /**
     * Send a message to another user
     * Publishes to RabbitMQ and stores in MongoDB
     */
    async sendMessage(senderId: string, sendMessageDto: SendMessageDto): Promise<MessageDocument> {
        const { receiverId, content, parentMessageId } = sendMessageDto;

        // Validate receiver exists (this would ideally check the User model)
        if (!Types.ObjectId.isValid(receiverId)) {
            throw new BadRequestException('Invalid receiver ID');
        }

        // Create thread ID for the conversation
        const threadId = this.generateThreadId(senderId, receiverId);

        // Create message document
        const message = new this.messageModel({
            senderId: new Types.ObjectId(senderId),
            receiverId: new Types.ObjectId(receiverId),
            content,
            threadId,
            parentMessageId: parentMessageId ? new Types.ObjectId(parentMessageId) : null,
            isRead: false,
        });

        await message.save();

        // Add message to BST for threading
        this.messageTree.insert({
            id: message._id,
            content: message.content,
            parentMessageId: message.parentMessageId,
        } as any);

        // Add to unread queue
        this.unreadMessagesQueue.enqueue({
            messageId: message._id,
            receiverId,
            senderId,
            timestamp: new Date(),
        });

        // Update user graph to track relationships
        this.userGraph.addEdge(senderId, receiverId);

        // Publish to RabbitMQ
        await this.rabbitMQService.publishMessage({
            messageId: message._id,
            senderId,
            receiverId,
            content,
            threadId,
            timestamp: new Date(),
        });

        // Send notification to receiver
        await this.rabbitMQService.sendMessageNotification(receiverId, senderId, content);

        return message;
    }

    /**
     * View messages between current user and another user
     * Supports pagination and message threading
     */
    async viewMessages(userId: string, viewMessagesDto: ViewMessagesDto): Promise<any> {
        const { otherUserId, page = 1, limit = 20 } = viewMessagesDto;

        if (!Types.ObjectId.isValid(otherUserId)) {
            throw new BadRequestException('Invalid user ID');
        }

        const skip = (page - 1) * limit;

        // Find messages between the two users
        const messages = await this.messageModel
            .find({
                $or: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId },
                ],
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('senderId', 'username')
            .populate('receiverId', 'username');

        const totalMessages = await this.messageModel.countDocuments({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId },
            ],
        });

        // Mark messages as read
        await this.messageModel.updateMany(
            {
                senderId: otherUserId,
                receiverId: userId,
                isRead: false,
            },
            {
                $set: { isRead: true, readAt: new Date() },
            },
        );

        // Organize messages by threading using BST
        const organizedMessages = this.organizeMessagesByThread(messages);

        return {
            messages: organizedMessages,
            pagination: {
                page,
                limit,
                totalMessages,
                totalPages: Math.ceil(totalMessages / limit),
                hasNextPage: page < Math.ceil(totalMessages / limit),
                hasPrevPage: page > 1,
            },
        };
    }

    /**
     * Get unread messages count for a user
     */
    async getUnreadCount(userId: string): Promise<number> {
        return this.messageModel.countDocuments({
            receiverId: userId,
            isRead: false,
        });
    }

    /**
     * Get user conversations list
     */
    async getConversations(userId: string): Promise<any[]> {
        const conversations = await this.messageModel.aggregate([
            {
                $match: {
                    $or: [{ senderId: new Types.ObjectId(userId) }, { receiverId: new Types.ObjectId(userId) }],
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $group: {
                    _id: '$threadId',
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [{ $and: [{ $eq: ['$receiverId', new Types.ObjectId(userId)] }, { $eq: ['$isRead', false] }] }, 1, 0],
                        },
                    },
                },
            },
            {
                $sort: { 'lastMessage.createdAt': -1 },
            },
        ]);

        return conversations;
    }

    /**
     * Generate a consistent thread ID for a conversation
     * Private helper method
     */
    private generateThreadId(userId1: string, userId2: string): string {
        const ids = [userId1, userId2].sort();
        return `${ids[0]}_${ids[1]}`;
    }

    /**
     * Organize messages by threading
     * Private helper method using BST
     */
    private organizeMessagesByThread(messages: any[]): any[] {
        // Group messages by parent-child relationship
        const messageMap = new Map();
        const rootMessages: any[] = [];

        messages.forEach((msg) => {
            messageMap.set(msg._id.toString(), { ...msg.toObject(), replies: [] });
        });

        messages.forEach((msg) => {
            const messageObj = messageMap.get(msg._id.toString());

            if (msg.parentMessageId) {
                const parent = messageMap.get(msg.parentMessageId.toString());
                if (parent) {
                    parent.replies.push(messageObj);
                } else {
                    rootMessages.push(messageObj);
                }
            } else {
                rootMessages.push(messageObj);
            }
        });

        return rootMessages;
    }

    /**
     * Get user relationships using Graph data structure
     */
    getUserRelationships(userId: string): string[] {
        return this.userGraph.getNeighbors(userId);
    }

    /**
     * Find shortest path between two users in the conversation graph
     */
    findConversationPath(userId1: string, userId2: string): string[] | null {
        return this.userGraph.shortestPath(userId1, userId2);
    }
}
