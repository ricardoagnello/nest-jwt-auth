import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { ProtectedController } from './auth/protected.controller';
import { ConfigModule } from '@nestjs/config';
import { InvalidTokenModule } from './invalid-token/invalid-token.module';
import { InvalidToken } from './auth/entities/invalidToken.entity';
import { VerifyInvalidTokenMiddleware } from './auth/middleware/verify-invalid-token.middleware';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, InvalidToken],
      synchronize: true,
    }),
    AuthModule,
    InvalidTokenModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyInvalidTokenMiddleware).forRoutes('*');
  }
}
