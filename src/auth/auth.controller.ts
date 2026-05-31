import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleCodeDto } from './dto/google-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('google/code')
  googleLogin(@Body() dto: GoogleCodeDto) {
    return this.authService.googleLogin(dto.code);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: { user: { id: string; email: string } }) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: { user: { id: string; email: string } }) {
    return req.user;
  }
}
