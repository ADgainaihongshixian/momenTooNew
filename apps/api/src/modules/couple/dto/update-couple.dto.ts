import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCoupleDto {
  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  anniversaryDate?: string;

  @ApiPropertyOptional({ example: '已订婚' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  relationship?: string;
}
