import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        birthday: true,
        gender: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('用户不存在');
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        birthday: true,
        gender: true,
      },
    });
  }

  async getStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { couple: true },
    });
    if (!user?.couple) return { moments: 0, diaries: 0, photos: 0, daysCount: 0 };

    const coupleId = user.couple.id;
    const [moments, diaries, photos] = await Promise.all([
      this.prisma.moment.count({ where: { coupleId } }),
      this.prisma.diary.count({ where: { coupleId } }),
      this.prisma.media.count({ where: { coupleId } }),
    ]);

    const daysCount = Math.floor(
      (Date.now() - new Date(user.couple.anniversaryDate).getTime()) / (1000 * 60 * 60 * 24),
    );

    return { moments, diaries, photos, daysCount };
  }
}
