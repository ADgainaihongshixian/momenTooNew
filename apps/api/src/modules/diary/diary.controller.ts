import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('日记')
@ApiBearerAuth()
@Controller('diaries')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  @ApiOperation({ summary: '创建日记' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateDiaryDto) {
    return this.diaryService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取日记列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    return this.diaryService.findAll(userId, page || 1, limit || 20, year, month);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单篇日记' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.diaryService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新日记' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDiaryDto,
  ) {
    return this.diaryService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除日记' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.diaryService.remove(userId, id);
  }
}
