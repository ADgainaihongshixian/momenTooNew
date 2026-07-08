import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('媒体')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiOperation({ summary: '上传媒体文件' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMediaDto })
  upload(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: any,
    @Body() dto: CreateMediaDto,
  ) {
    return this.mediaService.upload(userId, file, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取媒体列表' })
  @ApiQuery({ name: 'momentId', required: false })
  findAll(@CurrentUser('id') userId: string, @Query('momentId') momentId?: string) {
    return this.mediaService.findAll(userId, momentId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个媒体' })
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.mediaService.findOne(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除媒体' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.mediaService.remove(userId, id);
  }
}
