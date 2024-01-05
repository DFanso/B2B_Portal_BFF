import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<any> {
    const ORDER_MICRO_API = this.configService.get<string>('ORDER_MICRO_API');

    try {
      const response = await this.httpService
        .post(ORDER_MICRO_API, createOrderDto)
        .toPromise();
      console.log(response);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to create order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
