import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMediaDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiPropertyOptional({ example: 'moment-id-here' })
  @IsOptional()
  @IsString()
  momentId?: string;
}
