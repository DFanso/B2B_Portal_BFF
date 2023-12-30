import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { ulid } from 'ulid';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
    validationSchema: Joi.object({
      AWS_REGION: Joi.string().required(),
      COGNITO_CLIENT_ID: Joi.string().required(),
      COGNITO_CLIENT_SECRET: Joi.string().required(),
      USER_MICRO_API: Joi.string().required(),
      PRODUCT_MICRO_API: Joi.string().required(),
      ORDER_MICRO_API: Joi.string().required(),
      COGNITO_USER_POOL_ID: Joi.string().required(),
    }),
  }),
  ClsModule.forRoot({
    middleware: {
      mount: true,
      setup: (cls, req, res) => {
        const requestId = ulid();
        cls.set('x-request-id', requestId);
        res.setHeader('X-Request-ID', requestId);
      },
    },
  }),
  AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
