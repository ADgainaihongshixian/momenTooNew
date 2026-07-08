import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDiaryDto {
  @ApiPropertyOptional({ example: '更新标题' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ example: '更新内容' })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  content?: string;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @ApiPropertyOptional({ example: '2024-06-15' })
  @IsOptional()
  @IsDateString()
  diaryDate?: string;
}
