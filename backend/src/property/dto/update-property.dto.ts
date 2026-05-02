import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  zaloId?: string;

  @IsOptional()
  @IsString()
  checkinTime?: string;

  @IsOptional()
  @IsString()
  checkoutTime?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  depositPercent?: number;
}
