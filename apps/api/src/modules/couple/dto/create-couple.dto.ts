import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCoupleDto {
  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  declare anniversaryDate: string;

  @ApiPropertyOptional({ example: '在一起啦！' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  relationship?: string;
}
