import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ProductResponseDto } from './dto/product-response.dto';

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

  async findAll(): Promise<ProductResponseDto[]> {
    const PRODUCT_MICRO_API =
      this.configService.get<string>('PRODUCT_MICRO_API');

    try {
      const response = await this.httpService
        .get(`${PRODUCT_MICRO_API}`)
        .toPromise();

      if (!response.data) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }

      return response.data.map((product) => ({
        productId: product.productId,
        name: product.name,
        description: product.description,
        price: product.price,
        status: product.status,
        supplierId: product.supplierId,
        images: product.images,
      }));
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve products: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findBySupplier(id: string): Promise<ProductResponseDto[]> {
    const PRODUCT_MICRO_API =
      this.configService.get<string>('PRODUCT_MICRO_API');

    try {
      const response = await this.httpService
        .get(`${PRODUCT_MICRO_API}/supplier/${id}`)
        .toPromise();

      if (!response.data) {
        throw new HttpException('No products found', HttpStatus.NOT_FOUND);
      }

      return response.data.map((product) => ({
        productId: product.productId,
        name: product.name,
        description: product.description,
        price: product.price,
        status: product.status,
        supplierId: product.supplierId,
        images: product.images,
      }));
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve products: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const PRODUCT_MICRO_API =
      this.configService.get<string>('PRODUCT_MICRO_API');

    try {
      const response = await this.httpService
        .get(`${PRODUCT_MICRO_API}/${id}`)
        .toPromise();

      if (!response.data) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      const productResponse: ProductResponseDto = {
        productId: response.data.productId,
        name: response.data.name,
        description: response.data.description,
        price: response.data.price,
        status: response.data.status,
        supplierId: response.data.supplierId,
        images: response.data.images,
      };

      return productResponse;
    } catch (error) {
      throw new HttpException(
        `Failed to find product: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const PRODUCT_MICRO_API =
      this.configService.get<string>('PRODUCT_MICRO_API');
    const url = `${PRODUCT_MICRO_API}/${id}`;
    const headersRequest = {
      'Content-Type': 'application/json',
    };
    try {
      const response = await this.httpService
        .put(url, JSON.stringify(updateProductDto), {
          headers: headersRequest,
        })
        .toPromise();

      const productResponse: ProductResponseDto = {
        productId: response.data.productId,
        name: response.data.name,
        description: response.data.description,
        price: response.data.price,
        status: response.data.status,
        supplierId: response.data.supplierId,
        images: response.data.images,
      };

      return productResponse;
    } catch (error) {
      throw new HttpException(
        `Failed to update product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<any> {
    const PRODUCT_MICRO_API =
      this.configService.get<string>('PRODUCT_MICRO_API');
    const url = `${PRODUCT_MICRO_API}/${id}`;

    try {
      const response = await this.httpService.delete(url).toPromise();
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to delete product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
