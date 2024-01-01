import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const PRODUCT_MICRO_API =
      this.configService.get<string>('PRODUCT_MICRO_API');

    try {
      const response = await this.httpService
        .post(PRODUCT_MICRO_API, createProductDto)
        .toPromise();

      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to create product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
