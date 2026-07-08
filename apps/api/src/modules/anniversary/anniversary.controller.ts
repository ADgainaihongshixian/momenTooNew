import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnniversaryService } from './anniversary.service';
import { CreateAnniversaryDto } from './dto/create-anniversary.dto';
import { UpdateAnniversaryDto } from './dto/update-anniversary.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('纪念日')
@ApiBearerAuth()
@Controller('anniversaries')
export class AnniversaryController {
  constructor(private readonly anniversaryService: AnniversaryService) {}

  @Post()
  @ApiOperation({ summary: '创建纪念日' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateAnniversaryDto) {
    return this.anniversaryService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取纪念日列表' })
  findAll(@CurrentUser('id') userId: string) {
    return this.anniversaryService.findAll(userId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: '获取即将到来的纪念日' })
  getUpcoming(@CurrentUser('id') userId: string) {
    return this.anniversaryService.getUpcoming(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个纪念日' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.anniversaryService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新纪念日' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAnniversaryDto,
  ) {
    return this.anniversaryService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除纪念日' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.anniversaryService.remove(userId, id);
  }
}
