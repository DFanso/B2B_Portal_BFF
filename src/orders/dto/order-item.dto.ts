import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class OrderItemDTO {
  @ApiProperty({ example: 789 })
  @IsNotEmpty({ message: 'Product ID is mandatory' })
  productId: number;

  @IsString({ message: 'Product Description is mandatory' })
  productDescription: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsNumber()
  price: number;

  @IsNotEmpty({ message: 'Supplier ID is mandatory' })
  supplierId: string;

  @IsString({ message: 'Supplier Name is mandatory' })
  supplierName: string;
}
