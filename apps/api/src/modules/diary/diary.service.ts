import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Injectable()
export class DiaryService {
  constructor(private readonly prisma: PrismaService) {}

  private async getCoupleId(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { couple: true },
    });
    if (!user?.couple) throw new NotFoundException('尚未绑定情侣关系');
    return user.couple.id;
  }

  async create(userId: string, dto: CreateDiaryDto) {
    const coupleId = await this.getCoupleId(userId);

    return this.prisma.diary.create({
      data: {
        title: dto.title,
        content: dto.content,
        mood: dto.mood,
        weather: dto.weather,
        isPrivate: dto.isPrivate ?? false,
        diaryDate: dto.diaryDate ? new Date(dto.diaryDate) : new Date(),
        coupleId,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, nickname: true, avatar: true } },
      },
    });
  }

  async findAll(userId: string, page: number, limit: number, year?: number, month?: number) {
    const coupleId = await this.getCoupleId(userId);
    const skip = (page - 1) * limit;

    const where: any = { coupleId };
    if (year && month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      where.diaryDate = { gte: start, lte: end };
    }

    const [items, total] = await Promise.all([
      this.prisma.diary.findMany({
        where,
        orderBy: { diaryDate: 'desc' },
        skip,
        take: limit,
        include: {
          author: { select: { id: true, nickname: true, avatar: true } },
        },
      }),
      this.prisma.diary.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(userId: string, id: string) {
    const coupleId = await this.getCoupleId(userId);
    const diary = await this.prisma.diary.findFirst({
      where: { id, coupleId },
      include: {
        author: { select: { id: true, nickname: true, avatar: true } },
      },
    });
    if (!diary) throw new NotFoundException('日记不存在');

    if (diary.isPrivate && diary.authorId !== userId) {
      throw new ForbiddenException('这是一篇私密日记');
    }

    return diary;
  }

  async update(userId: string, id: string, dto: UpdateDiaryDto) {
    const coupleId = await this.getCoupleId(userId);
    const diary = await this.prisma.diary.findFirst({ where: { id, coupleId } });
    if (!diary) throw new NotFoundException('日记不存在');
    if (diary.authorId !== userId) throw new ForbiddenException('只能修改自己的日记');

    return this.prisma.diary.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.mood !== undefined && { mood: dto.mood }),
        ...(dto.weather !== undefined && { weather: dto.weather }),
        ...(dto.isPrivate !== undefined && { isPrivate: dto.isPrivate }),
        ...(dto.diaryDate && { diaryDate: new Date(dto.diaryDate) }),
      },
      include: {
        author: { select: { id: true, nickname: true, avatar: true } },
      },
    });
  }

  async remove(userId: string, id: string) {
    const coupleId = await this.getCoupleId(userId);
    const diary = await this.prisma.diary.findFirst({ where: { id, coupleId } });
    if (!diary) throw new NotFoundException('日记不存在');
    if (diary.authorId !== userId) throw new ForbiddenException('只能删除自己的日记');

    await this.prisma.diary.delete({ where: { id } });
    return { message: '已删除' };
  }
}
