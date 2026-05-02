import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

type RequestUser = {
  id: string;
  propertyId: string;
  role: UserRole;
};

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@Req() req: { user: RequestUser }) {
    return this.usersService.getMe(req.user.id, req.user.propertyId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  @Get()
  list(@Req() req: { user: RequestUser }) {
    return this.usersService.listByProperty(req.user.propertyId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  @Post()
  create(@Req() req: { user: RequestUser }, @Body() dto: CreateUserDto) {
    return this.usersService.createStaff(req.user.propertyId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  @Patch(':id')
  update(
    @Req() req: { user: RequestUser },
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateById(req.user.propertyId, id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  @Delete(':id')
  remove(@Req() req: { user: RequestUser }, @Param('id') id: string) {
    return this.usersService.removeStaff(req.user.propertyId, id);
  }
}
