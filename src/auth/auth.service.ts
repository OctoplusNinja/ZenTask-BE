import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return null;
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  login(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(dto: RegisterDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.userService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    const { passwordHash: _, ...safeUser } = user;
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: safeUser,
    };
  }

  async googleLogin(code: string) {
    const clientId = this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET');
    const client = new OAuth2Client(clientId, clientSecret);
    const { tokens } = await client
      .getToken({ code, redirect_uri: 'http://localhost:3000/auth/google/callback' })
      .catch(() => {
        throw new UnauthorizedException('Invalid or expired Google auth code');
      });
    const { id_token } = tokens;
    if (!id_token) throw new UnauthorizedException('No ID token returned');
    const ticket = await client.verifyIdToken({ idToken: id_token, audience: clientId });
    const payload = ticket.getPayload();

    if (!payload?.email) throw new UnauthorizedException('Invalid Google Token');

    const { email, name } = payload;
    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.create({ name: name ?? email, email, passwordHash: '' });
    }
    const { passwordHash: _, ...safeUser } = user;
    const tokenPayload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(tokenPayload),
      user: safeUser,
    };
  }
}
