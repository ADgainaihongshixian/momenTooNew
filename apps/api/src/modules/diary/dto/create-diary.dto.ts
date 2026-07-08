import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDiaryDto {
  @ApiProperty({ example: '今天的心情' })
  @IsString()
  @MaxLength(100)
  declare title: string;

  @ApiProperty({ example: '今天过得真开心...' })
  @IsString()
  @MaxLength(10000)
  declare content: string;

  @ApiPropertyOptional({ example: '开心' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  mood?: string;

  @ApiPropertyOptional({ example: '晴' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  weather?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @ApiPropertyOptional({ example: '2024-06-15' })
  @IsOptional()
  @IsDateString()
  diaryDate?: string;
}
