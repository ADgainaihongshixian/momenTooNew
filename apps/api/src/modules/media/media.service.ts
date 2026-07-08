import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { mkdirSync, existsSync, unlinkSync } from 'fs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';

@Injectable()
export class MediaService {
  private readonly uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
  }

  private async getCoupleId(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { couple: true },
    });
    if (!user?.couple) throw new NotFoundException('尚未绑定情侣关系');
    return user.couple.id;
  }

  async upload(userId: string, file: any, dto: CreateMediaDto) {
    const coupleId = await this.getCoupleId(userId);

    const ext = file.originalname.split('.').pop() || 'bin';
    const filename = `${randomUUID()}.${ext}`;
    const dir = join(this.uploadDir, userId);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const filePath = join(dir, filename);
    const { writeFileSync } = await import('fs');
    writeFileSync(filePath, file.buffer);

    const mediaType = file.mimetype.startsWith('image/')
      ? 'IMAGE'
      : file.mimetype.startsWith('video/')
        ? 'VIDEO'
        : file.mimetype.startsWith('audio/')
          ? 'AUDIO'
          : 'FILE';

    const urlPath = `/uploads/${userId}/${filename}`;

    return this.prisma.media.create({
      data: {
        url: urlPath,
        type: mediaType,
        filename: file.originalname,
        size: file.size,
        momentId: dto.momentId || null,
        coupleId,
        uploaderId: userId,
      },
    });
  }

  async findAll(userId: string, momentId?: string) {
    const coupleId = await this.getCoupleId(userId);
    const where: any = { coupleId };
    if (momentId) where.momentId = momentId;

    return this.prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        uploader: { select: { id: true, nickname: true } },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const coupleId = await this.getCoupleId(userId);
    const media = await this.prisma.media.findFirst({
      where: { id, coupleId },
      include: {
        uploader: { select: { id: true, nickname: true } },
      },
    });
    if (!media) throw new NotFoundException('媒体不存在');
    return media;
  }

  async remove(userId: string, id: string) {
    const coupleId = await this.getCoupleId(userId);
    const media = await this.prisma.media.findFirst({ where: { id, coupleId } });
    if (!media) throw new NotFoundException('媒体不存在');

    const fullPath = join(process.cwd(), media.url);
    if (existsSync(fullPath)) {
      try { unlinkSync(fullPath); } catch {}
    }

    await this.prisma.media.delete({ where: { id } });
    return { message: '已删除' };
  }
}
