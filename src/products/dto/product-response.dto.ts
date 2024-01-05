import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class ProductResponseDto {
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Gadget',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A useful gadget',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 19.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Status of the product',
    example: 'Available',
  })
  @IsString()
  status: string;

  @IsString()
  supplierId: string;

  @ApiProperty({
    description: 'Array of image URLs for the product',
    example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
