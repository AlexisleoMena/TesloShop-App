import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { DefaultEntity } from 'src/common/entities/default.entity';

export class CreateUserDto extends DefaultEntity {
  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean = true;
}
