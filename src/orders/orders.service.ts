import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UpdateOrderDto } from './dto/update-order.dto';

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

  async findAll() {
    const ORDER_MICRO_API = this.configService.get<string>('ORDER_MICRO_API');

    try {
      const response = await this.httpService.get(ORDER_MICRO_API).toPromise();
      console.log(response);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to Get orders: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findOne(id: number) {
    const ORDER_MICRO_API = this.configService.get<string>('ORDER_MICRO_API');

    try {
      const response = await this.httpService
        .get(`${ORDER_MICRO_API}/${id}`)
        .toPromise();
      console.log(response);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to Get order: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByCustomerId(customerId: string): Promise<any> {
    const ORDER_MICRO_API = this.configService.get<string>('ORDER_MICRO_API');

    try {
      const response = await this.httpService
        .get(`${ORDER_MICRO_API}/customer/${customerId}`)
        .toPromise();
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to get orders for customer: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findBySupplierId(supplierId: string): Promise<any> {
    const ORDER_MICRO_API = this.configService.get<string>('ORDER_MICRO_API');

    try {
      const response = await this.httpService
        .get(`${ORDER_MICRO_API}/supplier/${supplierId}`)
        .toPromise();
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to get orders for supplier: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateStatus(id: string, newStatus: string): Promise<any> {
    const ORDER_MICRO_API = this.configService.get<string>('ORDER_MICRO_API');

    try {
      const response = await this.httpService
        .put(`${ORDER_MICRO_API}/${id}/status`, { newStatus })
        .toPromise();
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to update order status: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<any> {
    const ORDER_MICRO_API = this.configService.get<string>('ORDER_MICRO_API');

    try {
      const response = await this.httpService
        .put(`${ORDER_MICRO_API}/${id}`, updateOrderDto)
        .toPromise();
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to update order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<any> {
    const ORDER_MICRO_API = this.configService.get<string>('ORDER_MICRO_API');

    try {
      const response = await this.httpService
        .delete(`${ORDER_MICRO_API}/${id}`)
        .toPromise();
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to delete order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
