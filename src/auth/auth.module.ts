import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProtectedController } from './protected.controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([User]),
      JwtModule.registerAsync({
        imports: [ConfigModule], 
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'), 
          signOptions: { expiresIn: '60m' },
        }),
        inject: [ConfigService],
      }),
    ],
    providers: [AuthService, JwtStrategy, LocalStrategy],
    controllers: [AuthController, ProtectedController],
  })
  export class AuthModule {}
