import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnniversaryDto {
  @ApiProperty({ example: '在一起纪念日' })
  @IsString()
  @MaxLength(100)
  declare title: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  declare date: string;

  @ApiPropertyOptional({ enum: ['ONCE', 'YEARLY', 'MONTHLY'], default: 'YEARLY' })
  @IsOptional()
  @IsEnum(['ONCE', 'YEARLY', 'MONTHLY'])
  repeatType?: string;

  @ApiPropertyOptional({ example: 3, description: '提前提醒天数，0为不提醒' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(30)
  reminder?: number;
}
