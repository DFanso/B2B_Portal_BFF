import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { ClsModule } from 'nestjs-cls';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UsersModule, ProductsModule, ClsModule, HttpModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
