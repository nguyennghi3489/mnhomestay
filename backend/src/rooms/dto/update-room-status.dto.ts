import { RoomStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateRoomStatusDto {
  @IsEnum(RoomStatus)
  status!: RoomStatus;
}
