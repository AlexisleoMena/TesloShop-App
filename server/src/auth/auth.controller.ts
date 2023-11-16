import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RefreshResponse, LoginDto, LoginRespose } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PayloadToken } from './interfaces/token.interface';
import { AuthService } from './auth.service';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

type AuthorizedRequest = Express.Request & {
  headers: { authorization: string };
  user: PayloadToken;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: LoginRespose, status: 200 })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  login(@Request() req: AuthorizedRequest) {
    const payloadToken: PayloadToken = req.user;
    return this.authService.login(payloadToken);
  }

  @ApiResponse({ status: 200, type: RefreshResponse })
  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: AuthorizedRequest) {
    const payloadToken: PayloadToken = req.user;
    const refreshResponse: RefreshResponse = {
      accessToken: this.authService.createToken(payloadToken),
    };
    return refreshResponse;
  }

  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logOut(@GetUser() user: User) {
    await this.authService.logout(user);
  }
}
