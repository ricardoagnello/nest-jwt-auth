import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { InvalidTokenService } from 'src/invalid-token/invalid-token.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private invalidTokenService: InvalidTokenService
      ) {}

    async register(dto: RegisterDto): Promise<User> {
        const { email, password } = dto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ email, password: hashedPassword });
        return this.userRepository.save(user);
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email }});
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        // Gera o access token
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload);
      
        // Gera o refresh token
        const refreshToken = await this.generateRefreshToken(user.id);
      
        // Atualiza o refresh token no banco de dados
        await this.updateRefreshToken(user.id, refreshToken);
      
        return {
          access_token: accessToken,
          refresh_token: refreshToken,
        };
      }
      
         generateToken(user: any) {
            return this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
      }

    async generateRefreshToken(userId: number): Promise<string> {
        const payload = { sub: userId };
        return this.jwtService.sign(payload, { expiresIn: '7d' });
    }

    async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
        await this.userRepository.update(userId, { refreshToken });
    }

    async validateRefreshToken(userId: number, refreshToken: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user && user.refreshToken === refreshToken) {
          return user; // Retorna o usuário se o token for válido
        }
        return null; // Retorna null se o token for inválido
      }

      async logout(token: string): Promise<void> {
        await this.invalidTokenService.invalidateToken(token);
      }
}
