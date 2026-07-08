import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCoupleDto } from './dto/create-couple.dto';
import { UpdateCoupleDto } from './dto/update-couple.dto';

@Injectable()
export class CoupleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCoupleDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { couple: true },
    });
    if (user?.couple) {
      throw new ConflictException('你已经处于一段情侣关系中');
    }

    return this.prisma.couple.create({
      data: {
        anniversaryDate: new Date(dto.anniversaryDate),
        users: { connect: { id: userId } },
      },
    });
  }

  async getMyCouple(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { couple: true },
    });
    if (!user?.couple) throw new NotFoundException('尚未绑定情侣关系');
    return user.couple;
  }

  async getCoupleInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        couple: {
          include: {
            users: {
              select: { id: true, nickname: true, avatar: true, email: true },
            },
          },
        },
      },
    });
    if (!user?.couple) throw new NotFoundException('尚未绑定情侣关系');
    return user.couple;
  }

  async update(userId: string, dto: UpdateCoupleDto) {
    const couple = await this.getMyCouple(userId);
    return this.prisma.couple.update({
      where: { id: couple.id },
      data: {
        ...(dto.anniversaryDate && { anniversaryDate: new Date(dto.anniversaryDate) }),
        ...(dto.relationship && { relationship: dto.relationship }),
      },
    });
  }

  async generateInvite(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { couple: true },
    });

    let couple = user?.couple;

    if (!couple) {
      couple = await this.prisma.couple.create({
        data: {
          anniversaryDate: new Date(),
          users: { connect: { id: userId } },
        },
      });
    }

    const inviteCode = randomBytes(6).toString('hex').toUpperCase();

    await this.prisma.couple.update({
      where: { id: couple.id },
      data: { inviteCode },
    });

    return { inviteCode };
  }

  async joinByInvite(userId: string, inviteCode: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { couple: true },
    });
    if (user?.couple) {
      throw new ConflictException('你已经处于一段情侣关系中');
    }

    const couple = await this.prisma.couple.findFirst({
      where: { inviteCode },
    });
    if (!couple) {
      throw new BadRequestException('邀请码无效');
    }

    return this.prisma.couple.update({
      where: { id: couple.id },
      data: {
        users: { connect: { id: userId } },
        inviteCode: null,
      },
    });
  }
}
