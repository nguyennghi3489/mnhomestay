import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetAvailabilityQueryDto } from './dto/get-availability-query.dto';
import { AvailabilityService } from './availability.service';

type RequestUser = {
  id: string;
  propertyId: string;
};

@ApiTags('Availability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  getAvailability(@Req() req: { user: RequestUser }, @Query() query: GetAvailabilityQueryDto) {
    return this.availabilityService.getAvailability(req.user.propertyId, query.from, query.to);
  }
}
