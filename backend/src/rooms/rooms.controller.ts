import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';
import { RoomsService } from './rooms.service';

type RequestUser = {
  id: string;
  propertyId: string;
  role: UserRole;
};

@ApiTags('Rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  list(@Req() req: { user: RequestUser }) {
    return this.roomsService.listByProperty(req.user.propertyId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  @Post()
  create(@Req() req: { user: RequestUser }, @Body() dto: CreateRoomDto) {
    return this.roomsService.create(req.user.propertyId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  @Patch(':id')
  update(@Req() req: { user: RequestUser }, @Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.updateById(req.user.propertyId, id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  @Patch(':id/status')
  updateStatus(
    @Req() req: { user: RequestUser },
    @Param('id') id: string,
    @Body() dto: UpdateRoomStatusDto,
  ) {
    return this.roomsService.updateStatusById(req.user.propertyId, id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  @Delete(':id')
  remove(@Req() req: { user: RequestUser }, @Param('id') id: string) {
    return this.roomsService.softDelete(req.user.propertyId, id);
  }
}
