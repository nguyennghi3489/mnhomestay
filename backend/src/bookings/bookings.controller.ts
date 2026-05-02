import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

type RequestUser = {
  id: string;
  propertyId: string;
};

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  list(@Req() req: { user: RequestUser }, @Query() query: QueryBookingsDto) {
    return this.bookingsService.list(req.user.propertyId, query);
  }

  @Get(':id')
  getById(@Req() req: { user: RequestUser }, @Param('id') id: string) {
    return this.bookingsService.getById(req.user.propertyId, id);
  }

  @Post()
  create(@Req() req: { user: RequestUser }, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(req.user.propertyId, req.user.id, dto);
  }

  @Patch(':id')
  update(@Req() req: { user: RequestUser }, @Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.updateById(req.user.propertyId, id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Req() req: { user: RequestUser },
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatusById(req.user.propertyId, id, dto);
  }

  @Delete(':id')
  cancel(@Req() req: { user: RequestUser }, @Param('id') id: string) {
    return this.bookingsService.cancelById(req.user.propertyId, id);
  }
}
