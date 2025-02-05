import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvalidToken } from 'src/auth/entities/invalidToken.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvalidTokenService {
    constructor(
        @InjectRepository(InvalidToken)
        private invalidTokenRepository: Repository<InvalidToken>,
    ) {}

    async invalidateToken(token: string): Promise<void> {
        const invalidToken = this.invalidTokenRepository.create({ token });
        await this.invalidTokenRepository.save(invalidToken);
    }

    async isInvalidToken(token: string): Promise<boolean> {
        const invalidToken = await this.invalidTokenRepository.findOne({ where: { token }});
        return !!invalidToken;
    }
}
