import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductImageRespose {
  @Expose()
  @ApiProperty()
  readonly id: number;

  @Expose()
  @ApiProperty()
  readonly url: string;
}
