import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  declare email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  declare password: string;

  @ApiProperty({ example: '小明' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  declare nickname: string;
}
