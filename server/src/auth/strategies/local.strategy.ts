import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { PayloadToken } from '../interfaces/token.interface';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<PayloadToken> {
    const user: User = await this.usersService.findByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return { id: user.id, role: user.role };
    }

    throw new UnauthorizedException('Invalid credentials.');
  }
}
