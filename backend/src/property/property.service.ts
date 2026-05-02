import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(propertyId: string) {
    const property = await this.prismaService.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        zaloId: true,
        checkinTime: true,
        checkoutTime: true,
        depositPercent: true,
        currency: true,
        createdAt: true,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async updateById(propertyId: string, dto: UpdatePropertyDto) {
    await this.getById(propertyId);

    return this.prismaService.property.update({
      where: { id: propertyId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.address !== undefined ? { address: dto.address } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.zaloId !== undefined ? { zaloId: dto.zaloId } : {}),
        ...(dto.checkinTime !== undefined ? { checkinTime: dto.checkinTime } : {}),
        ...(dto.checkoutTime !== undefined ? { checkoutTime: dto.checkoutTime } : {}),
        ...(dto.depositPercent !== undefined ? { depositPercent: dto.depositPercent } : {}),
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        zaloId: true,
        checkinTime: true,
        checkoutTime: true,
        depositPercent: true,
        currency: true,
        createdAt: true,
      },
    });
  }
}
