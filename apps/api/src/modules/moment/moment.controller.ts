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
import { MomentService } from './moment.service';
import { CreateMomentDto } from './dto/create-moment.dto';
import { UpdateMomentDto } from './dto/update-moment.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('时间线')
@ApiBearerAuth()
@Controller('moments')
export class MomentController {
  constructor(private readonly momentService: MomentService) {}

  @Post()
  @ApiOperation({ summary: '创建时间线记录' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateMomentDto) {
    return this.momentService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取时间线列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.momentService.findAll(userId, page || 1, limit || 20);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单条时间线记录' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.momentService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新时间线记录' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMomentDto,
  ) {
    return this.momentService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除时间线记录' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.momentService.remove(userId, id);
  }
}
