import { ConfigType } from '@nestjs/config';
import appConfig from './app.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function createTypeOrmModuleConfig(
  configService: ConfigType<typeof appConfig>,
): TypeOrmModuleOptions {
  const isProduction = configService.env === 'prod';
  const { database } = configService;
  return {
    ssl: isProduction,
    extra: {
      ssl: isProduction ? { rejectUnauthorized: false } : null,
    },
    type: 'postgres',
    host: database.host,
    port: database.port,
    username: database.userName,
    password: database.password,
    database: database.database,
    autoLoadEntities: true,
    synchronize: true,
  };
}
