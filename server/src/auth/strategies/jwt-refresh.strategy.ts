import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import appConfig from '../../config/app.config';
import { UsersService } from '../../users/users.service';
import { PayloadToken } from '../interfaces/token.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @Inject(appConfig.KEY)
    private configService: ConfigType<typeof appConfig>,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwt.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: PayloadToken): Promise<PayloadToken> {
    const refreshToken = request.headers.authorization.split(' ')[1];

    return this.userService.findByRefreshToken(refreshToken, payload.id);
  }
}
