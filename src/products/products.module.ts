import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ClsModule } from 'nestjs-cls';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ClsModule, HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
