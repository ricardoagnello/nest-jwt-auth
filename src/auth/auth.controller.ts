import { Body, Controller, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { InvalidTokenService } from 'src/invalid-token/invalid-token.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
      private invalidTokenSrvice: InvalidTokenService
    ){}

    @Post('register')
    async register(@Body(ValidationPipe) registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    @HttpCode(HttpStatus.OK)
    async login(@Req() req) {
      return this.authService.login(req.user);
    }

    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Req() req, @Body() refreshTokenDto: RefreshTokenDto) {
      const userId = req.user.sub;
      
      // Valida o refresh token
      const user = await this.authService.validateRefreshToken(userId, refreshTokenDto.refreshToken);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
  
      // Gera novos tokens
      const accessToken = this.authService.generateToken(user);
      const refreshToken = await this.authService.generateRefreshToken(user.id);
      
      // Atualiza o refresh token no banco
      await this.authService.updateRefreshToken(user.id, refreshToken);
  
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req) {
      const token = req.headers.authorization.split(' ')[1];
      await this.invalidTokenSrvice.invalidateToken(token);
      return { message: 'Logout realizado com sucesso' };
    }


    
}



