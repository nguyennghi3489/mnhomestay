import { PrismaClient, BookingSource, BookingStatus, PaymentMethod, PaymentStatus, RoomStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultPasswordHash = await bcrypt.hash('localstay123', 10);

  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.user.deleteMany();
  await prisma.room.deleteMany();
  await prisma.property.deleteMany();

  const property = await prisma.property.create({
    data: {
      name: 'LocalStay Riverside Homestay',
      address: '12 Tran Phu, Hoi An, Quang Nam',
      phone: '0901234567',
      zaloId: 'localstay-riverside',
      users: {
        create: [
          {
            name: 'Nguyen Van Owner',
            phone: '0901111111',
            passwordHash: defaultPasswordHash,
            role: UserRole.OWNER,
          },
          {
            name: 'Tran Thi Staff',
            phone: '0902222222',
            passwordHash: defaultPasswordHash,
            role: UserRole.STAFF,
          },
        ],
      },
      rooms: {
        create: [
          {
            name: 'Deluxe River View 101',
            roomType: 'DELUXE',
            maxOccupancy: 2,
            baseRate: '750000',
            status: RoomStatus.AVAILABLE,
          },
          {
            name: 'Deluxe River View 102',
            roomType: 'DELUXE',
            maxOccupancy: 2,
            baseRate: '750000',
            status: RoomStatus.AVAILABLE,
          },
          {
            name: 'Family Suite 201',
            roomType: 'SUITE',
            maxOccupancy: 4,
            baseRate: '1200000',
            status: RoomStatus.AVAILABLE,
          },
          {
            name: 'Garden Standard 301',
            roomType: 'STANDARD',
            maxOccupancy: 2,
            baseRate: '550000',
            status: RoomStatus.MAINTENANCE,
          },
        ],
      },
    },
    include: {
      rooms: true,
      users: true,
    },
  });

  const owner = property.users.find(user => user.role === UserRole.OWNER);
  const bookableRoom = property.rooms.find(room => room.status === RoomStatus.AVAILABLE);

  if (!owner || !bookableRoom) {
    throw new Error('Seed prerequisites missing after property creation.');
  }

  const booking = await prisma.booking.create({
    data: {
      propertyId: property.id,
      roomId: bookableRoom.id,
      guestName: 'Le Thi Guest',
      guestPhone: '0903333333',
      checkinDate: new Date('2026-05-02T14:00:00.000Z'),
      checkoutDate: new Date('2026-05-04T12:00:00.000Z'),
      adults: 2,
      children: 0,
      totalAmount: '1500000',
      depositAmount: '450000',
      depositPaid: true,
      status: BookingStatus.CONFIRMED,
      source: BookingSource.WALKIN,
      notes: 'Sample seeded booking',
      createdBy: owner.id,
      payments: {
        create: {
          amount: '450000',
          method: PaymentMethod.CASH,
          status: PaymentStatus.COMPLETED,
          transactionRef: 'SEED-DEPOSIT-001',
          paidAt: new Date('2026-04-30T07:00:00.000Z'),
        },
      },
    },
  });

  console.log(
    JSON.stringify(
      {
        propertyId: property.id,
        roomCount: property.rooms.length,
        userCount: property.users.length,
        bookingId: booking.id,
      },
      null,
      2,
    ),
  );
}

main()
  .catch(async error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });