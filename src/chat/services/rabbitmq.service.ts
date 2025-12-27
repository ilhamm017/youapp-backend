import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;
    private readonly logger = new Logger(RabbitMQService.name);
    private readonly rabbitmqUrl: string;
    private readonly messageQueue: string;
    private readonly notificationQueue: string;

    constructor(private configService: ConfigService) {
        this.rabbitmqUrl = this.configService.get<string>('rabbitmq.url')!;
        this.messageQueue = this.configService.get<string>('rabbitmq.queues.messages')!;
        this.notificationQueue = this.configService.get<string>('rabbitmq.queues.notifications')!;
    }

    async onModuleInit() {
        await this.connect();
    }

    async onModuleDestroy() {
        await this.disconnect();
    }

    /**
     * Establish connection to RabbitMQ
     */
    private async connect(): Promise<void> {
        try {
            this.logger.log('Connecting to RabbitMQ...');
            this.connection = await amqp.connect(this.rabbitmqUrl);
            this.channel = await this.connection.createChannel();

            // Assert queues
            await this.channel.assertQueue(this.messageQueue, { durable: true });
            await this.channel.assertQueue(this.notificationQueue, { durable: true });

            this.logger.log('Successfully connected to RabbitMQ');

            // Handle connection errors
            this.connection.on('error', (err) => {
                this.logger.error('RabbitMQ connection error:', err);
            });

            this.connection.on('close', () => {
                this.logger.warn('RabbitMQ connection closed. Attempting to reconnect...');
                setTimeout(() => this.connect(), 5000);
            });
        } catch (error) {
            this.logger.error('Failed to connect to RabbitMQ:', error);
            // Retry connection after 5 seconds
            setTimeout(() => this.connect(), 5000);
        }
    }

    /**
     * Disconnect from RabbitMQ
     */
    private async disconnect(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            this.logger.log('Disconnected from RabbitMQ');
        } catch (error) {
            this.logger.error('Error disconnecting from RabbitMQ:', error);
        }
    }

    /**
     * Publish message to messages queue
     */
    async publishMessage(message: any): Promise<boolean> {
        try {
            if (!this.channel) {
                throw new Error('RabbitMQ channel not initialized');
            }

            const messageBuffer = Buffer.from(JSON.stringify(message));
            const published = this.channel.sendToQueue(
                this.messageQueue,
                messageBuffer,
                { persistent: true },
            );

            if (published) {
                this.logger.log(`Message published to queue: ${this.messageQueue}`);
            }

            return published;
        } catch (error) {
            this.logger.error('Error publishing message:', error);
            return false;
        }
    }

    /**
     * Publish notification to notifications queue
     */
    async publishNotification(notification: any): Promise<boolean> {
        try {
            if (!this.channel) {
                throw new Error('RabbitMQ channel not initialized');
            }

            const notificationBuffer = Buffer.from(JSON.stringify(notification));
            const published = this.channel.sendToQueue(
                this.notificationQueue,
                notificationBuffer,
                { persistent: true },
            );

            if (published) {
                this.logger.log(`Notification published to queue: ${this.notificationQueue}`);
            }

            return published;
        } catch (error) {
            this.logger.error('Error publishing notification:', error);
            return false;
        }
    }

    /**
     * Consume messages from messages queue
     */
    async consumeMessages(callback: (message: any) => void): Promise<void> {
        try {
            if (!this.channel) {
                throw new Error('RabbitMQ channel not initialized');
            }

            await this.channel.consume(
                this.messageQueue,
                (msg) => {
                    if (msg) {
                        const content = JSON.parse(msg.content.toString());
                        callback(content);
                        this.channel!.ack(msg);
                    }
                },
                { noAck: false },
            );

            this.logger.log(`Started consuming messages from queue: ${this.messageQueue}`);
        } catch (error) {
            this.logger.error('Error consuming messages:', error);
        }
    }

    /**
     * Consume notifications from notifications queue
     */
    async consumeNotifications(callback: (notification: any) => void): Promise<void> {
        try {
            if (!this.channel) {
                throw new Error('RabbitMQ channel not initialized');
            }

            await this.channel.consume(
                this.notificationQueue,
                (msg) => {
                    if (msg) {
                        const content = JSON.parse(msg.content.toString());
                        callback(content);
                        this.channel!.ack(msg);
                    }
                },
                { noAck: false },
            );

            this.logger.log(`Started consuming notifications from queue: ${this.notificationQueue}`);
        } catch (error) {
            this.logger.error('Error consuming notifications:', error);
        }
    }

    /**
     * Send notification to user about new message
     */
    async sendMessageNotification(receiverId: string, senderId: string, messageContent: string): Promise<void> {
        const notification = {
            type: 'NEW_MESSAGE',
            receiverId,
            senderId,
            message: messageContent,
            timestamp: new Date(),
        };

        await this.publishNotification(notification);
    }
}
