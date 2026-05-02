import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyService } from './property.service';

type RequestUser = {
  id: string;
  propertyId: string;
  role: UserRole;
};

@ApiTags('Property')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  getProperty(@Req() req: { user: RequestUser }) {
    return this.propertyService.getById(req.user.propertyId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  @Patch()
  updateProperty(@Req() req: { user: RequestUser }, @Body() dto: UpdatePropertyDto) {
    return this.propertyService.updateById(req.user.propertyId, dto);
  }
}
