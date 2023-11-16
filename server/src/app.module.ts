import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';

import config from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation-schema';
import { createTypeOrmModuleConfig } from './config/type-orm.config';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['.env'],
      validationSchema: JoiValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: createTypeOrmModuleConfig,
    }),

    AuthModule,
    ProductsModule,
    UsersModule,
    SeedModule,
  ],
})
export class AppModule {}
