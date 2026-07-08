import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMomentDto } from './dto/create-moment.dto';
import { UpdateMomentDto } from './dto/update-moment.dto';

@Injectable()
export class MomentService {
  constructor(private readonly prisma: PrismaService) {}

  private async getCoupleId(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { couple: true },
    });
    if (!user?.couple) throw new NotFoundException('尚未绑定情侣关系');
    return user.couple.id;
  }

  async create(userId: string, dto: CreateMomentDto) {
    const coupleId = await this.getCoupleId(userId);

    return this.prisma.moment.create({
      data: {
        title: dto.title,
        content: dto.content,
        momentDate: dto.momentDate ? new Date(dto.momentDate) : new Date(),
        category: dto.category ?? 'OTHER',
        location: dto.location,
        mood: dto.mood,
        coupleId,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, nickname: true, avatar: true } },
        medias: true,
      },
    });
  }

  async findAll(userId: string, page: number, limit: number) {
    const coupleId = await this.getCoupleId(userId);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.moment.findMany({
        where: { coupleId },
        orderBy: { momentDate: 'desc' },
        skip,
        take: limit,
        include: {
          author: { select: { id: true, nickname: true, avatar: true } },
          medias: true,
        },
      }),
      this.prisma.moment.count({ where: { coupleId } }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(userId: string, id: string) {
    const coupleId = await this.getCoupleId(userId);
    const moment = await this.prisma.moment.findFirst({
      where: { id, coupleId },
      include: {
        author: { select: { id: true, nickname: true, avatar: true } },
        medias: true,
      },
    });
    if (!moment) throw new NotFoundException('记录不存在');
    return moment;
  }

  async update(userId: string, id: string, dto: UpdateMomentDto) {
    const coupleId = await this.getCoupleId(userId);
    const moment = await this.prisma.moment.findFirst({ where: { id, coupleId } });
    if (!moment) throw new NotFoundException('记录不存在');
    if (moment.authorId !== userId) throw new ForbiddenException('只能修改自己创建的记录');

    return this.prisma.moment.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.momentDate && { momentDate: new Date(dto.momentDate) }),
        ...(dto.category && { category: dto.category }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.mood !== undefined && { mood: dto.mood }),
      },
      include: {
        author: { select: { id: true, nickname: true, avatar: true } },
        medias: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    const coupleId = await this.getCoupleId(userId);
    const moment = await this.prisma.moment.findFirst({ where: { id, coupleId } });
    if (!moment) throw new NotFoundException('记录不存在');
    if (moment.authorId !== userId) throw new ForbiddenException('只能删除自己创建的记录');

    await this.prisma.moment.delete({ where: { id } });
    return { message: '已删除' };
  }
}
