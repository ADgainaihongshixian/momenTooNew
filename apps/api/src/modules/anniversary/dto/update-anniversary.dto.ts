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
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAnniversaryDto {
  @ApiPropertyOptional({ example: '更新标题' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ enum: ['ONCE', 'YEARLY', 'MONTHLY'] })
  @IsOptional()
  @IsEnum(['ONCE', 'YEARLY', 'MONTHLY'])
  repeatType?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(30)
  reminder?: number;
}
