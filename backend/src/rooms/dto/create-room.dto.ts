import { RoomStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name!: string;

  @IsString()
  roomType!: string;

  @IsInt()
  @Min(1)
  @Max(20)
  maxOccupancy!: number;

  @IsNumber()
  @Min(0)
  baseRate!: number;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}
