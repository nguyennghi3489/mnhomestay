import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, Prisma, RoomStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  async listByProperty(propertyId: string) {
    return this.prismaService.room.findMany({
      where: {
        propertyId,
        isActive: true,
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        propertyId: true,
        name: true,
        roomType: true,
        maxOccupancy: true,
        baseRate: true,
        status: true,
      },
    });
  }

  async create(propertyId: string, dto: CreateRoomDto) {
    return this.prismaService.room.create({
      data: {
        propertyId,
        name: dto.name,
        roomType: dto.roomType,
        maxOccupancy: dto.maxOccupancy,
        baseRate: new Prisma.Decimal(dto.baseRate),
        status: dto.status ?? RoomStatus.AVAILABLE,
      },
      select: {
        id: true,
        propertyId: true,
        name: true,
        roomType: true,
        maxOccupancy: true,
        baseRate: true,
        status: true,
      },
    });
  }

  async updateById(propertyId: string, roomId: string, dto: UpdateRoomDto) {
    await this.ensureRoom(propertyId, roomId);

    return this.prismaService.room.update({
      where: { id: roomId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.roomType !== undefined ? { roomType: dto.roomType } : {}),
        ...(dto.maxOccupancy !== undefined ? { maxOccupancy: dto.maxOccupancy } : {}),
        ...(dto.baseRate !== undefined ? { baseRate: new Prisma.Decimal(dto.baseRate) } : {}),
      },
      select: {
        id: true,
        propertyId: true,
        name: true,
        roomType: true,
        maxOccupancy: true,
        baseRate: true,
        status: true,
      },
    });
  }

  async updateStatusById(propertyId: string, roomId: string, dto: UpdateRoomStatusDto) {
    await this.ensureRoom(propertyId, roomId);

    return this.prismaService.room.update({
      where: { id: roomId },
      data: { status: dto.status },
      select: {
        id: true,
        propertyId: true,
        name: true,
        roomType: true,
        maxOccupancy: true,
        baseRate: true,
        status: true,
      },
    });
  }

  async softDelete(propertyId: string, roomId: string) {
    await this.ensureRoom(propertyId, roomId);

    const activeBooking = await this.prismaService.booking.findFirst({
      where: {
        propertyId,
        roomId,
        status: {
          notIn: [BookingStatus.CHECKED_OUT, BookingStatus.CANCELLED],
        },
      },
      select: { id: true },
    });

    if (activeBooking) {
      throw new ForbiddenException('Cannot delete room with active bookings');
    }

    await this.prismaService.room.update({
      where: { id: roomId },
      data: { isActive: false },
    });

    return { success: true };
  }

  private async ensureRoom(propertyId: string, roomId: string) {
    const room = await this.prismaService.room.findFirst({
      where: {
        id: roomId,
        propertyId,
        isActive: true,
      },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException('Room not found for this property');
    }
  }
}
