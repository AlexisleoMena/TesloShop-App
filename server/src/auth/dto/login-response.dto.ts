import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginRespose {
  @ApiProperty()
  @Expose()
  readonly accessToken: string;

  @ApiProperty()
  @Expose()
  readonly refreshToken: string;
}
