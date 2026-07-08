import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMomentDto {
  @ApiProperty({ example: '第一次约会' })
  @IsString()
  @MaxLength(100)
  declare title: string;

  @ApiPropertyOptional({ example: '今天去了公园，很开心~' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  content?: string;

  @ApiPropertyOptional({ example: '2024-06-15' })
  @IsOptional()
  @IsDateString()
  momentDate?: string;

  @ApiPropertyOptional({
    enum: ['DATE', 'TRAVEL', 'FOOD', 'GIFT', 'MILESTONE', 'OTHER'],
    default: 'OTHER',
  })
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
