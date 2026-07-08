export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum CoupleStatus {
  ACTIVE = 'ACTIVE',
  DISSOLVED = 'DISSOLVED',
}

export enum Mood {
  HAPPY = 'HAPPY',
  CALM = 'CALM',
  MISSING = 'MISSING',
  WRONGED = 'WRONGED',
  ANGRY = 'ANGRY',
  ANXIOUS = 'ANXIOUS',
}

export enum AnniversaryType {
  FIRST_MEET = 'FIRST_MEET',
  FIRST_KISS = 'FIRST_KISS',
  FIRST_TRAVEL = 'FIRST_TRAVEL',
  PROPOSAL = 'PROPOSAL',
  CUSTOM = 'CUSTOM',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  nickname: string;
  avatar?: string;
  gender?: Gender;
  birthday?: string;
  coupleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Couple {
  id: string;
  inviteCode: string;
  startDate?: string;
  status: CoupleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Moment {
  id: string;
  coupleId: string;
  authorId: string;
  content: string;
  mood: Mood;
  weather?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  aiTitle?: string;
  isPrivate: boolean;
  media: Media[];
  author: Pick<User, 'id' | 'nickname' | 'avatar'>;
  createdAt: string;
  updatedAt: string;
}

export interface Diary {
  id: string;
  coupleId: string;
  title: string;
  content: string;
  authorId: string;
  mood: Mood;
  isPrivate: boolean;
  comments: DiaryComment[];
  author: Pick<User, 'id' | 'nickname' | 'avatar'>;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryComment {
  id: string;
  diaryId: string;
  authorId: string;
  content: string;
  author: Pick<User, 'id' | 'nickname' | 'avatar'>;
  createdAt: string;
}

export interface Anniversary {
  id: string;
  coupleId: string;
  title: string;
  date: string;
  type: AnniversaryType;
  icon?: string;
  remindBefore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  userId: string;
  momentId?: string;
  diaryId?: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  gender?: Gender;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface CreateMomentRequest {
  content: string;
  mood: Mood;
  weather?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  mediaIds?: string[];
  isPrivate?: boolean;
}

export interface CreateDiaryRequest {
  title: string;
  content: string;
  mood: Mood;
  isPrivate?: boolean;
}

export interface CreateAnniversaryRequest {
  title: string;
  date: string;
  type: AnniversaryType;
  icon?: string;
  remindBefore?: number;
}
