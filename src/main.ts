import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*', // Configure this for production
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('YouApp Backend API')
    .setDescription('NestJS Backend API for YouApp with MongoDB, JWT Auth, and RabbitMQ')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User registration and login endpoints')
    .addTag('Users & Profile', 'User profile management endpoints')
    .addTag('Chat', 'Messaging and chat endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   🚀 YouApp Backend API is running!                  ║
  ║                                                       ║
  ║   📍 Server:      http://localhost:${port}           ║
  ║   📚 Swagger:     http://localhost:${port}/api/docs  ║
  ║   🐰 RabbitMQ:    http://localhost:15672             ║
  ║   🍃 MongoDB:     localhost:27017                    ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
}

bootstrap();

