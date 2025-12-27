import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    uri:
        process.env.MONGODB_URI ||
        'mongodb://admin:password123@localhost:27017/youapp?authSource=admin',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
}));
