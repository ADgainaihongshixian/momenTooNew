export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Couple {
  id: string;
  user1Id: string;
  user2Id: string;
  startDate: string;
  status: 'pending' | 'bound' | 'unbound';
  createdAt: string;
}

export interface CoupleWithUsers extends Couple {
  user1: User;
  user2: User;
}

export interface Memory {
  id: string;
  coupleId: string;
  authorId: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  mood?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryEntry {
  id: string;
  coupleId: string;
  authorId: string;
  title: string;
  content: string;
  mood: MoodType;
  images: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Anniversary {
  id: string;
  coupleId: string;
  title: string;
  date: string;
  type: AnniversaryType;
  repeatYearly: boolean;
  reminder?: ReminderConfig;
  createdAt: string;
}

export interface ReminderConfig {
  enabled: boolean;
  daysBefore: number;
}

export type MoodType = 'happy' | 'love' | 'calm' | 'sad' | 'angry' | 'excited';

export type AnniversaryType = 'together' | 'birthday' | 'custom';

export interface TimelineFilter {
  startDate?: string;
  endDate?: string;
  tags?: string[];
  authorId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface BindCoupleRequest {
  inviteCode: string;
}

export interface SocketEvents {
  'memory:created': (memory: Memory) => void;
  'diary:created': (diary: DiaryEntry) => void;
  'anniversary:reminder': (anniversary: Anniversary) => void;
  'couple:updated': (couple: Couple) => void;
}