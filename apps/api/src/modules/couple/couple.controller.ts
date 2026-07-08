import { Controller, Get, Post, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CoupleService } from './couple.service';
import { CreateCoupleDto } from './dto/create-couple.dto';
import { UpdateCoupleDto } from './dto/update-couple.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('情侣')
@ApiBearerAuth()
@Controller('couple')
export class CoupleController {
  constructor(private readonly coupleService: CoupleService) {}

  @Post()
  @ApiOperation({ summary: '创建情侣关系' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateCoupleDto) {
    return this.coupleService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取当前情侣信息' })
  getMyCouple(@CurrentUser('id') userId: string) {
    return this.coupleService.getMyCouple(userId);
  }

  @Patch()
  @ApiOperation({ summary: '更新情侣信息' })
  update(@CurrentUser('id') userId: string, @Body() dto: UpdateCoupleDto) {
    return this.coupleService.update(userId, dto);
  }

  @Get('info')
  @ApiOperation({ summary: '获取情侣详情（含双方信息）' })
  getCoupleInfo(@CurrentUser('id') userId: string) {
    return this.coupleService.getCoupleInfo(userId);
  }

  @Post('invite')
  @ApiOperation({ summary: '生成邀请码' })
  generateInvite(@CurrentUser('id') userId: string) {
    return this.coupleService.generateInvite(userId);
  }

  @Post('join')
  @ApiOperation({ summary: '通过邀请码加入' })
  joinByInvite(@CurrentUser('id') userId: string, @Body('inviteCode') inviteCode: string) {
    return this.coupleService.joinByInvite(userId, inviteCode);
  }
}
