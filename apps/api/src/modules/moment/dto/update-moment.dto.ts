import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMomentDto {
  @ApiPropertyOptional({ example: '更新标题' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ example: '更新内容' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  content?: string;

  @ApiPropertyOptional({ example: '2024-06-15' })
  @IsOptional()
  @IsDateString()
  momentDate?: string;

  @ApiPropertyOptional({ enum: ['DATE', 'TRAVEL', 'FOOD', 'GIFT', 'MILESTONE', 'OTHER'] })
  @IsOptional()
  @IsEnum(['DATE', 'TRAVEL', 'FOOD', 'GIFT', 'MILESTONE', 'OTHER'])
  category?: string;

  @ApiPropertyOptional({ example: '上海外滩' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ example: '开心' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  mood?: string;
}
