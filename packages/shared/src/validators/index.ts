import { z } from 'zod';
import { Mood, Gender, AnniversaryType } from '../types';

export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位').max(100, '密码最多100位'),
});

export const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位').max(100, '密码最多100位'),
  nickname: z.string().min(1, '请输入昵称').max(50, '昵称最多50个字符'),
  gender: z.nativeEnum(Gender).optional(),
});

export const createMomentSchema = z.object({
  content: z.string().min(1, '请输入内容').max(5000, '内容最多5000个字符'),
  mood: z.nativeEnum(Mood),
  weather: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  mediaIds: z.array(z.string().uuid()).optional(),
  isPrivate: z.boolean().optional().default(false),
});

export const createDiarySchema = z.object({
  title: z.string().min(1, '请输入标题').max(200, '标题最多200个字符'),
  content: z.string().min(1, '请输入内容').max(50000, '内容最多50000个字符'),
  mood: z.nativeEnum(Mood),
  isPrivate: z.boolean().optional().default(false),
});

export const createDiaryCommentSchema = z.object({
  content: z.string().min(1, '请输入评论内容').max(1000, '评论最多1000个字符'),
});

export const createAnniversarySchema = z.object({
  title: z.string().min(1, '请输入标题').max(100, '标题最多100个字符'),
  date: z.string().datetime(),
  type: z.nativeEnum(AnniversaryType),
  icon: z.string().optional(),
  remindBefore: z.number().int().min(0).max(365).optional().default(7),
});

export const bindCoupleSchema = z.object({
  inviteCode: z.string().length(6, '邀请码为6位'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateMomentInput = z.infer<typeof createMomentSchema>;
export type CreateDiaryInput = z.infer<typeof createDiarySchema>;
export type CreateDiaryCommentInput = z.infer<typeof createDiaryCommentSchema>;
export type CreateAnniversaryInput = z.infer<typeof createAnniversarySchema>;
export type BindCoupleInput = z.infer<typeof bindCoupleSchema>;
