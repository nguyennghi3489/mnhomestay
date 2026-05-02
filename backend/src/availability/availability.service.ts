import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type AvailabilitySlot = {
  date: string;
  bookingId: string | null;
  guestName: string | null;
  status: string | null;
  checkinDate: string | null;
  checkoutDate: string | null;
};

type AvailabilityRoom = {
  roomId: string;
  roomName: string;
  slots: AvailabilitySlot[];
};

@Injectable()
export class AvailabilityService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAvailability(propertyId: string, from: string, to: string): Promise<AvailabilityRoom[]> {
    const fromDate = this.parseDateOnly(from, 'from');
    const toDate = this.parseDateOnly(to, 'to');

    if (toDate < fromDate) {
      throw new BadRequestException('`to` must be greater than or equal to `from`');
    }

    const toExclusive = new Date(toDate);
    toExclusive.setUTCDate(toExclusive.getUTCDate() + 1);

    const [rooms, bookings] = await Promise.all([
      this.prismaService.room.findMany({
        where: {
          propertyId,
          isActive: true,
        },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
        },
      }),
      this.prismaService.booking.findMany({
        where: {
          propertyId,
          status: {
            not: BookingStatus.CANCELLED,
          },
          checkinDate: {
            lt: toExclusive,
          },
          checkoutDate: {
            gt: fromDate,
          },
          room: {
            isActive: true,
          },
        },
        select: {
          id: true,
          roomId: true,
          guestName: true,
          status: true,
          checkinDate: true,
          checkoutDate: true,
        },
      }),
    ]);

    const allDates = this.buildDateRange(fromDate, toDate);
    const bookingsByRoom = new Map<string, typeof bookings>();

    for (const booking of bookings) {
      const list = bookingsByRoom.get(booking.roomId) ?? [];
      list.push(booking);
      bookingsByRoom.set(booking.roomId, list);
    }

    return rooms.map((room) => {
      const roomBookings = bookingsByRoom.get(room.id) ?? [];

      const slots = allDates.map((date) => {
        const booking = roomBookings.find(
          (item) => item.checkinDate <= date && item.checkoutDate > date,
        );

        if (!booking) {
          return {
            date: this.formatDate(date),
            bookingId: null,
            guestName: null,
            status: null,
            checkinDate: null,
            checkoutDate: null,
          };
        }

        return {
          date: this.formatDate(date),
          bookingId: booking.id,
          guestName: booking.guestName,
          status: booking.status,
          checkinDate: this.formatDate(booking.checkinDate),
          checkoutDate: this.formatDate(booking.checkoutDate),
        };
      });

      return {
        roomId: room.id,
        roomName: room.name,
        slots,
      };
    });
  }

  private parseDateOnly(value: string, field: 'from' | 'to'): Date {
    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date for '${field}'. Use YYYY-MM-DD`);
    }

    return date;
  }

  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private buildDateRange(fromDate: Date, toDate: Date): Date[] {
    const dates: Date[] = [];
    const cursor = new Date(fromDate);

    while (cursor <= toDate) {
      dates.push(new Date(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return dates;
  }
}
