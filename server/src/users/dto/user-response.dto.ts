import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from '../../auth/interfaces/roles.enum';

export class UserResponse {
  @ApiProperty()
  @Expose()
  readonly email: string;

  @ApiProperty()
  @Expose()
  readonly fullName: string;

  @ApiProperty()
  @Expose()
  readonly isActive: boolean;

  @ApiProperty()
  @Expose()
  readonly role: Role;
}
