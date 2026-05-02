import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  maxOccupancy?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  baseRate?: number;
}
