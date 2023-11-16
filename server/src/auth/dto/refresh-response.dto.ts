import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RefreshResponse {
  @ApiProperty()
  @Expose()
  readonly accessToken: string;
}
