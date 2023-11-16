import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/interfaces/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRespose } from './dto/product-response.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, type: ProductRespose })
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @ApiResponse({ status: 200, isArray: true, type: ProductRespose })
  @Public()
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const products = await this.productsService.findAll(paginationDto);
    return products;
  }

  @ApiResponse({ status: 200, type: ProductRespose })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductRespose> {
    return this.productsService.findOne(+id);
  }

  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 201, type: ProductRespose })
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(+id, updateProductDto, user);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
