import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProductImageRespose } from './product-image-response.dto';

export class ProductRespose {
  @ApiProperty()
  @Expose()
  readonly title: string;

  @ApiProperty()
  @Expose()
  readonly price: number;

  @ApiProperty()
  @Expose()
  readonly description: string;

  @ApiProperty()
  @Expose()
  readonly slug: string;

  @ApiProperty()
  @Expose()
  readonly stock: number;

  @ApiProperty()
  @Expose()
  readonly sizes: string[];

  @ApiProperty()
  @Expose()
  readonly gender: string;

  @ApiProperty()
  @Expose()
  readonly tags: string[];

  @ApiProperty()
  @Expose()
  @Type(() => ProductImageRespose)
  images: ProductImageRespose[];
}
