import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    senderId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    receiverId: Types.ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ index: true })
    threadId: string;

    @Prop({ type: Types.ObjectId, ref: 'Message' })
    parentMessageId: Types.ObjectId;

    @Prop({ default: false, index: true })
    isRead: boolean;

    @Prop()
    readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Compound index for efficient querying of conversations
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });
MessageSchema.index({ threadId: 1, createdAt: 1 });
MessageSchema.index({ receiverId: 1, isRead: 1 });
