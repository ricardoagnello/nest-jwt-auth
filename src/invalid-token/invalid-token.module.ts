import { Module } from '@nestjs/common';
import { InvalidTokenService } from './invalid-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvalidToken } from 'src/invalid-token/invalidToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvalidToken])],
  providers: [InvalidTokenService],
  exports: [InvalidTokenService]
})
export class InvalidTokenModule {}
