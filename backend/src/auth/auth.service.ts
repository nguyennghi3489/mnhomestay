import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(phone: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { phone } });
    if (!user) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    return user;
  }

  async login(phone: string, password: string) {
    const user = await this.validateUser(phone, password);

    const payload = {
      sub: user.id,
      propertyId: user.propertyId,
      phone: user.phone,
      role: user.role,
      name: user.name,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '8h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        propertyId: user.propertyId,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        propertyId: string;
        phone: string;
        role: UserRole;
        name: string;
      }>(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET') || 'dev-jwt-secret-for-testing-only',
      });

      const user = await this.prismaService.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          propertyId: user.propertyId,
          phone: user.phone,
          role: user.role,
          name: user.name,
        },
        {
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '8h',
        },
      );

      return { access_token: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async register(dto: RegisterDto) {
    const existing = await this.prismaService.user.findUnique({ where: { phone: dto.phone } });
    if (existing) {
      throw new ConflictException('Phone already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        propertyId: dto.propertyId,
        name: dto.name,
        phone: dto.phone,
        role: dto.role ?? UserRole.STAFF,
        passwordHash,
      },
      select: {
        id: true,
        propertyId: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }
}
