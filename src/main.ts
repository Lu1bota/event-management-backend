import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Event Management API')
    .setDescription(
      'This is a comprehensive API documentation for the Event Management System. ' +
        'It provides endpoints for managing events, users, and registrations with full CRUD capabilities.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
