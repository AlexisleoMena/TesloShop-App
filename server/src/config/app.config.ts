import { registerAs } from '@nestjs/config';

export interface IAppConfig {
  env: string;
  port: number;
  host: string;
  database: {
    host: string;
    port: number;
    userName: string;
    password: string;
    database: string;
  };
  jwt: {
    jwtSecret: string;
    jwtRefreshSecret: string;
    refreshTokenExpiration: string;
    accessTokenExpiration: string;
  };
}

export default registerAs('appConfig', () => {
  return {
    env: process.env.NODE_ENV || 'dev',
    port: parseInt(process.env.NODE_API_PORT, 10) || 3000,
    host: process.env.NODE_API_HOST || 'localhost',
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      userName: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    jwt: {
      jwtSecret: process.env.JWT_SECRET,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
      accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
    },
  };
});
