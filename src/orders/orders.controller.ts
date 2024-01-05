import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/Types/user.types';
import { AuthGuard } from '@nestjs/passport';
import { OrderStatus } from 'src/Types/order.types';

@ApiTags('orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
    private readonly clsService: ClsService,
    private readonly productsService: ProductsService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({ type: CreateOrderDto })
  async create(@Body() createOrderDto: CreateOrderDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    try {
      const user = await this.usersService.findOne(context.user.id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      createOrderDto.customerId = user.userId;
      createOrderDto.customerName = user.name;
      createOrderDto.status = OrderStatus.Pending;

      for (const item of createOrderDto.items) {
        const product = await this.productsService.findOne(item.productId);
        if (!product) {
          throw new HttpException(
            `Product not found for id:  ${item.productId}`,
            HttpStatus.NOT_FOUND,
          );
        }
        const supplier = await this.usersService.findOne(product.supplierId);
        if (!supplier) {
          throw new HttpException(
            `Supplier not found for product ${item.supplierId}`,
            HttpStatus.NOT_FOUND,
          );
        }
        item.productDescription = product.description;
        item.price = product.price;
        item.supplierId = product.supplierId;
        item.supplierName = supplier.userId;
      }

      console.log(createOrderDto);
      return this.ordersService.create(createOrderDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of orders',
    type: [CreateOrderDto],
  })
  findAll() {
    return this.ordersService.findAll();
  }

  // Fetch orders by customer ID
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/customer')
  @ApiOperation({ summary: 'Get orders by customer ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of orders for the customer',
    type: [CreateOrderDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Customer not found',
  })
  async getOrdersByCustomerId() {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    try {
      const user = await this.usersService.findOne(context.user.id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return await this.ordersService.findByCustomerId(context.user.id);
    } catch (error) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
  }

  // Fetch orders by supplier ID
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/supplier')
  @ApiOperation({ summary: 'Get orders by supplier ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of orders for the supplier',
    type: [CreateOrderDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found',
  })
  async getOrdersBySupplierId() {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    try {
      const user = await this.usersService.findOne(context.user.id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return await this.ordersService.findBySupplierId(context.user.id);
    } catch (error) {
      throw new HttpException('Supplier not found', HttpStatus.NOT_FOUND);
    }
  }

  // Get order by ID
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order details',
    type: CreateOrderDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  async findOne(@Param('id') id: number) {
    try {
      return await this.ordersService.findOne(id);
    } catch (error) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  @ApiParam({ name: 'id', description: 'Order ID', type: String })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  // Remove an order
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Remove an order' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Order removed' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID of the order' })
  async remove(@Param('id') id: string) {
    try {
      return await this.ordersService.remove(+id);
    } catch (error) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
  }
}
