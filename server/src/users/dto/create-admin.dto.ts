import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { Role } from 'src/auth/interfaces/roles.enum';
import { CreateUserDto } from './create-user.dto';

export class CreateAdminDto extends CreateUserDto {
  @ApiProperty()
  @IsEnum(Role)
  @IsOptional()
  readonly role?: Role = Role.USER;
}
