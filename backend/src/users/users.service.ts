import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async listByProperty(propertyId: string) {
    return this.prismaService.user.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        propertyId: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getMe(userId: string, propertyId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        propertyId,
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createStaff(propertyId: string, dto: CreateUserDto) {
    if (dto.role && dto.role !== UserRole.STAFF) {
      throw new BadRequestException('Only STAFF role can be created via this endpoint');
    }

    const existingPhone = await this.prismaService.user.findUnique({
      where: { phone: dto.phone },
      select: { id: true },
    });

    if (existingPhone) {
      throw new ConflictException('Phone already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prismaService.user.create({
      data: {
        propertyId,
        name: dto.name,
        phone: dto.phone,
        role: UserRole.STAFF,
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
  }

  async updateById(propertyId: string, userId: string, dto: UpdateUserDto) {
    const target = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        propertyId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!target) {
      throw new NotFoundException('User not found for this property');
    }

    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.role !== undefined ? { role: dto.role } : {}),
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
  }

  async removeStaff(propertyId: string, userId: string) {
    const target = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        propertyId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!target) {
      throw new NotFoundException('User not found for this property');
    }

    if (target.role === UserRole.OWNER) {
      throw new ForbiddenException('Owner user cannot be removed');
    }

    await this.prismaService.user.delete({ where: { id: userId } });
    return { success: true };
  }
}
