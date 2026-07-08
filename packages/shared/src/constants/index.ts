import { Mood, AnniversaryType, MediaType } from '../types';

export const MOODS = [
  { value: Mood.HAPPY, label: '开心', emoji: '😊' },
  { value: Mood.CALM, label: '平静', emoji: '😌' },
  { value: Mood.MISSING, label: '想念', emoji: '🥺' },
  { value: Mood.WRONGED, label: '委屈', emoji: '😢' },
  { value: Mood.ANGRY, label: '生气', emoji: '😤' },
  { value: Mood.ANXIOUS, label: '焦虑', emoji: '😰' },
] as const;

export const ANNIVERSARY_TYPES = [
  { value: AnniversaryType.FIRST_MEET, label: '初次见面', emoji: '👋' },
  { value: AnniversaryType.FIRST_KISS, label: '初吻', emoji: '💋' },
  { value: AnniversaryType.FIRST_TRAVEL, label: '第一次旅行', emoji: '✈️' },
  { value: AnniversaryType.PROPOSAL, label: '求婚', emoji: '💍' },
  { value: AnniversaryType.CUSTOM, label: '自定义', emoji: '🎉' },
] as const;

export const WEATHER_OPTIONS = [
  '☀️ 晴天',
  '⛅ 多云',
  '🌧️ 雨天',
  '❄️ 雪天',
  '🌫️ 雾天',
  '🌙 夜晚',
] as const;

export const MEDIA_TYPES = {
  IMAGE: MediaType.IMAGE,
  VIDEO: MediaType.VIDEO,
  AUDIO: MediaType.AUDIO,
} as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

export const PAGE_SIZE = 20;
export const INVITE_CODE_LENGTH = 6;
export const INVITE_CODE_EXPIRY_HOURS = 24;

export const BRAND_COLORS = {
  creamPink: '#FFB6C1',
  mistPurple: '#B8A1FF',
  moonWhite: '#FFFDF9',
  starBlue: '#5B6CFF',
  warmGray: '#8A8A8A',
} as const;
