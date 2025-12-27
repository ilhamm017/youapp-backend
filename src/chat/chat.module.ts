import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { RabbitMQService } from './services/rabbitmq.service';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ],
    controllers: [ChatController],
    providers: [ChatService, RabbitMQService],
    exports: [ChatService, RabbitMQService],
})
export class ChatModule { }
