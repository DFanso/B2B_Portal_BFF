import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDTO } from './order-item.dto';
import { OrderStatus } from 'src/Types/order.types';

export class CreateOrderDto {
  orderId?: number;

  @ApiProperty({ example: 456 })
  @IsNotEmpty({ message: 'Customer ID is mandatory' })
  customerId: number;

  @ApiProperty({ type: [OrderItemDTO] })
  @IsNotEmpty({ message: 'Order items cannot be empty' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @IsDate({ message: 'Order date is mandatory' })
  orderDate: Date;

  @ApiProperty({ example: '123 Main St' })
  @IsString({ message: 'Delivery address is mandatory' })
  deliveryAddress: string;

  @ApiProperty({ example: '2024-01-02T00:00:00.000Z', required: false })
  deliveryDate?: Date;

  @IsString({ message: 'Order status is mandatory' })
  status: OrderStatus;

  @IsString({ message: 'Customer Name is mandatory' })
  customerName: string;
}
