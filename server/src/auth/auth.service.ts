import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import appConfig from '../config/app.config';
import { UsersService } from '../users/users.service';
import { PayloadToken } from './interfaces/token.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,

    private jwtService: JwtService,

    @Inject(appConfig.KEY)
    private configService: ConfigType<typeof appConfig>,
  ) {}

  createToken(payloadToken: PayloadToken) {
    return this.jwtService.sign(payloadToken);
  }
  createRefresh(payloadToken: PayloadToken) {
    const refreshToken = this.jwtService.sign(payloadToken, {
      secret: this.configService.jwt.jwtRefreshSecret,
      expiresIn: `${this.configService.jwt.refreshTokenExpiration}`,
    });

    return refreshToken;
  }
  async login(payloadToken: PayloadToken) {
    const accessToken = this.createToken(payloadToken);
    const refreshToken = this.createRefresh(payloadToken);
    await this.usersService.updateRefreshToken(refreshToken, payloadToken.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  logout(user: User) {
    return this.usersService.removeRefreshToken(user.id);
  }
}
