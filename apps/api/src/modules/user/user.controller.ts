import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('用户')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: '获取当前用户信息' })
  getMe(@CurrentUser('id') userId: string) {
    return this.userService.getMe(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: '更新当前用户信息' })
  updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateMe(userId, dto);
  }

  @Get('me/stats')
  @ApiOperation({ summary: '获取用户统计数据' })
  getStats(@CurrentUser('id') userId: string) {
    return this.userService.getStats(userId);
  }
}
