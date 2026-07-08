import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnniversaryDto } from './dto/create-anniversary.dto';
import { UpdateAnniversaryDto } from './dto/update-anniversary.dto';

@Injectable()
export class AnniversaryService {
  constructor(private readonly prisma: PrismaService) {}

  private async getCoupleId(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { couple: true },
    });
    if (!user?.couple) throw new NotFoundException('尚未绑定情侣关系');
    return user.couple.id;
  }

  async create(userId: string, dto: CreateAnniversaryDto) {
    const coupleId = await this.getCoupleId(userId);

    return this.prisma.anniversary.create({
      data: {
        title: dto.title,
        date: new Date(dto.date),
        repeatType: dto.repeatType ?? 'YEARLY',
        reminder: dto.reminder ?? 0,
        coupleId,
      },
    });
  }

  async findAll(userId: string) {
    const coupleId = await this.getCoupleId(userId);

    return this.prisma.anniversary.findMany({
      where: { coupleId },
      orderBy: { date: 'asc' },
    });
  }

  async getUpcoming(userId: string) {
    const coupleId = await this.getCoupleId(userId);
    const now = new Date();

    const anniversaries = await this.prisma.anniversary.findMany({
      where: { coupleId },
      orderBy: { date: 'asc' },
    });

    const upcoming = anniversaries
      .map((a) => {
        const thisYear = new Date(now.getFullYear(), a.date.getMonth(), a.date.getDate());
        const nextDate = thisYear < now
          ? new Date(now.getFullYear() + 1, a.date.getMonth(), a.date.getDate())
          : thisYear;
        const daysLeft = Math.ceil(
          (nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
        return { ...a, nextDate, daysLeft };
      })
      .filter((a) => a.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5);

    return upcoming;
  }

  async findOne(userId: string, id: string) {
    const coupleId = await this.getCoupleId(userId);
    const anniversary = await this.prisma.anniversary.findFirst({
      where: { id, coupleId },
    });
    if (!anniversary) throw new NotFoundException('纪念日不存在');
    return anniversary;
  }

  async update(userId: string, id: string, dto: UpdateAnniversaryDto) {
    const coupleId = await this.getCoupleId(userId);
    const anniversary = await this.prisma.anniversary.findFirst({
      where: { id, coupleId },
    });
    if (!anniversary) throw new NotFoundException('纪念日不存在');

    return this.prisma.anniversary.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.repeatType && { repeatType: dto.repeatType }),
        ...(dto.reminder !== undefined && { reminder: dto.reminder }),
      },
    });
  }

  async remove(userId: string, id: string) {
    const coupleId = await this.getCoupleId(userId);
    const anniversary = await this.prisma.anniversary.findFirst({
      where: { id, coupleId },
    });
    if (!anniversary) throw new NotFoundException('纪念日不存在');

    await this.prisma.anniversary.delete({ where: { id } });
    return { message: '已删除' };
  }
}
