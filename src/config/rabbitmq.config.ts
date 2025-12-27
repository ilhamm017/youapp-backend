import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    queues: {
        messages: process.env.QUEUE_MESSAGE || 'messages',
        notifications: process.env.QUEUE_NOTIFICATION || 'notifications',
    },
}));
