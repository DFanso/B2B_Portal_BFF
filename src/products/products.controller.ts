import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserType } from 'src/Types/user.types';
import { Product } from './entities/product.entity';
import { UsersService } from 'src/users/users.service';
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('products')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    createProductDto.supplierId = context.user.id;

    try {
      const user = await this.usersService.findOne(createProductDto.supplierId);
      if (user.type != UserType.Supplier) {
        throw new HttpException('Invalid supplier', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      throw new HttpException(`${error.message}`, HttpStatus.NOT_FOUND);
    }

    return this.productsService.create(createProductDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/supplier')
  @ApiOperation({ summary: 'Get a products by supplier' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  findBySupplier() {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.productsService.findBySupplier(context.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Product ID',
  })
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Product ID',
  })
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new HttpException(`Product Not found`, HttpStatus.NOT_FOUND);
    }
    if (product.supplierId != context.user.id) {
      throw new HttpException(
        `This product Not owned by this Supplier`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    updateProductDto.supplierId = context.user.id;
    updateProductDto.productId = product.productId;

    return this.productsService.update(id, updateProductDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product successfully deleted' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Product ID',
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
