import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async list(propertyId: string, query: QueryBookingsDto) {
    const where: Prisma.BookingWhereInput = {
      propertyId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.roomId ? { roomId: query.roomId } : {}),
    };

    const fromDate = query.from ? this.parseDateOnly(query.from, 'from') : null;
    const toDate = query.to ? this.parseDateOnly(query.to, 'to') : null;

    if (fromDate && toDate && toDate < fromDate) {
      throw new BadRequestException('`to` must be greater than or equal to `from`');
    }

    if (fromDate && toDate) {
      const toExclusive = this.addDays(toDate, 1);
      where.checkinDate = { lt: toExclusive };
      where.checkoutDate = { gt: fromDate };
    } else if (fromDate) {
      where.checkoutDate = { gt: fromDate };
    } else if (toDate) {
      const toExclusive = this.addDays(toDate, 1);
      where.checkinDate = { lt: toExclusive };
    }

    return this.prismaService.booking.findMany({
      where,
      orderBy: [{ checkinDate: 'asc' }, { createdAt: 'desc' }],
      include: {
        room: {
          select: {
            id: true,
            name: true,
            roomType: true,
          },
        },
      },
    });
  }

  async getById(propertyId: string, bookingId: string) {
    const booking = await this.prismaService.booking.findFirst({
      where: {
        id: bookingId,
        propertyId,
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            roomType: true,
            baseRate: true,
          },
        },
        payments: {
          orderBy: {
            paidAt: 'desc',
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found for this property');
    }

    return booking;
  }

  async create(propertyId: string, userId: string, dto: CreateBookingDto) {
    const checkinDate = this.parseDateOnly(dto.checkinDate, 'checkinDate');
    const checkoutDate = this.parseDateOnly(dto.checkoutDate, 'checkoutDate');
    this.ensureDateRange(checkinDate, checkoutDate);

    const room = await this.ensureActiveRoom(propertyId, dto.roomId);
    await this.ensureNoOverlap(propertyId, dto.roomId, checkinDate, checkoutDate);

    const { totalAmount, depositAmount } = await this.calculateAmounts(propertyId, room.baseRate, checkinDate, checkoutDate);

    return this.prismaService.booking.create({
      data: {
        propertyId,
        roomId: dto.roomId,
        guestName: dto.guestName,
        guestPhone: dto.guestPhone,
        checkinDate,
        checkoutDate,
        adults: dto.adults ?? 1,
        children: dto.children ?? 0,
        totalAmount,
        depositAmount,
        status: dto.status ?? undefined,
        source: dto.source ?? undefined,
        notes: dto.notes,
        createdBy: userId,
      },
    });
  }

  async updateById(propertyId: string, bookingId: string, dto: UpdateBookingDto) {
    const current = await this.ensureBooking(propertyId, bookingId);

    const roomId = dto.roomId ?? current.roomId;
    if (roomId !== current.roomId) {
      await this.ensureActiveRoom(propertyId, roomId);
    }

    const checkinDate = dto.checkinDate ? this.parseDateOnly(dto.checkinDate, 'checkinDate') : current.checkinDate;
    const checkoutDate = dto.checkoutDate ? this.parseDateOnly(dto.checkoutDate, 'checkoutDate') : current.checkoutDate;
    this.ensureDateRange(checkinDate, checkoutDate);

    const shouldCheckOverlap =
      roomId !== current.roomId ||
      dto.checkinDate !== undefined ||
      dto.checkoutDate !== undefined;

    if (shouldCheckOverlap) {
      await this.ensureNoOverlap(propertyId, roomId, checkinDate, checkoutDate, bookingId);
    }

    const room = await this.ensureActiveRoom(propertyId, roomId);
    const { totalAmount, depositAmount } = await this.calculateAmounts(propertyId, room.baseRate, checkinDate, checkoutDate);

    return this.prismaService.booking.update({
      where: { id: bookingId },
      data: {
        roomId,
        guestName: dto.guestName ?? current.guestName,
        guestPhone: dto.guestPhone ?? current.guestPhone,
        checkinDate,
        checkoutDate,
        adults: dto.adults ?? current.adults,
        children: dto.children ?? current.children,
        source: dto.source ?? current.source,
        notes: dto.notes ?? current.notes,
        totalAmount,
        depositAmount,
      },
    });
  }

  async updateStatusById(propertyId: string, bookingId: string, dto: UpdateBookingStatusDto) {
    const booking = await this.ensureBooking(propertyId, bookingId);

    if (booking.status === dto.status) {
      return booking;
    }

    this.ensureValidStatusTransition(booking.status, dto.status);

    return this.prismaService.booking.update({
      where: { id: bookingId },
      data: { status: dto.status },
    });
  }

  async cancelById(propertyId: string, bookingId: string) {
    const booking = await this.ensureBooking(propertyId, bookingId);

    if (booking.status === BookingStatus.CHECKED_OUT) {
      throw new ForbiddenException('Cannot cancel a checked-out booking');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return booking;
    }

    return this.prismaService.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  private async ensureBooking(propertyId: string, bookingId: string) {
    const booking = await this.prismaService.booking.findFirst({
      where: {
        id: bookingId,
        propertyId,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found for this property');
    }

    return booking;
  }

  private async ensureActiveRoom(propertyId: string, roomId: string) {
    const room = await this.prismaService.room.findFirst({
      where: {
        id: roomId,
        propertyId,
        isActive: true,
      },
      select: {
        id: true,
        baseRate: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found for this property');
    }

    return room;
  }

  private async ensureNoOverlap(
    propertyId: string,
    roomId: string,
    checkinDate: Date,
    checkoutDate: Date,
    excludeBookingId?: string,
  ) {
    const overlap = await this.prismaService.booking.findFirst({
      where: {
        propertyId,
        roomId,
        ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
        status: {
          notIn: [BookingStatus.CANCELLED, BookingStatus.CHECKED_OUT],
        },
        checkinDate: {
          lt: checkoutDate,
        },
        checkoutDate: {
          gt: checkinDate,
        },
      },
      select: { id: true },
    });

    if (overlap) {
      throw new ConflictException('Room already booked for overlapping dates');
    }
  }

  private async calculateAmounts(propertyId: string, baseRate: Prisma.Decimal, checkinDate: Date, checkoutDate: Date) {
    const property = await this.prismaService.property.findUnique({
      where: { id: propertyId },
      select: { depositPercent: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const nights = this.calculateNights(checkinDate, checkoutDate);
    const baseRateNumber = Number(baseRate);
    const total = baseRateNumber * nights;
    const deposit = (total * property.depositPercent) / 100;

    return {
      totalAmount: new Prisma.Decimal(total),
      depositAmount: new Prisma.Decimal(deposit),
    };
  }

  private calculateNights(checkinDate: Date, checkoutDate: Date) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((checkoutDate.getTime() - checkinDate.getTime()) / msPerDay);
  }

  private ensureDateRange(checkinDate: Date, checkoutDate: Date) {
    if (checkoutDate <= checkinDate) {
      throw new BadRequestException('checkoutDate must be later than checkinDate');
    }
  }

  private parseDateOnly(value: string, field: 'from' | 'to' | 'checkinDate' | 'checkoutDate') {
    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date for '${field}'. Use YYYY-MM-DD`);
    }

    return date;
  }

  private addDays(value: Date, days: number) {
    const next = new Date(value);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
  }

  private ensureValidStatusTransition(current: BookingStatus, next: BookingStatus) {
    const allowed: Record<BookingStatus, BookingStatus[]> = {
      PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
      CONFIRMED: [BookingStatus.CHECKED_IN, BookingStatus.CANCELLED],
      CHECKED_IN: [BookingStatus.CHECKED_OUT],
      CHECKED_OUT: [],
      CANCELLED: [],
    };

    if (!allowed[current].includes(next)) {
      throw new BadRequestException(`Invalid status transition from ${current} to ${next}`);
    }
  }
}
