import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useRequestLogging } from './request-logging';
import { VersioningType } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
    bodyParser: true,
  });
  useRequestLogging(app);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(
    '/api',
    basicAuth({
      challenge: true,
      users: {
        admin: 'admin',
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('B2B Portal BFF')
    .setDescription('B2B Portal BFF API')
    .setVersion('1.0')
    .addTag('B2B_Portal')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
