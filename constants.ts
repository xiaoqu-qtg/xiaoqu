import { Roommate } from './types';

export const MOCK_ROOMMATES: Roommate[] = [
  { id: 'u1', name: '阿强', avatar: 'bg-blue-500' },
  { id: 'u2', name: '小明', avatar: 'bg-green-500' },
  { id: 'u3', name: '老张', avatar: 'bg-purple-500' },
  { id: 'u4', name: '大力', avatar: 'bg-orange-500' },
];

export const TASKS = [
  '倒垃圾',
  '扫地拖地',
  '刷厕所',
  '订桶装水',
  '整理公共桌面'
];

export const NOTE_COLORS = [
  'bg-yellow-100 border-yellow-200',
  'bg-pink-100 border-pink-200',
  'bg-blue-100 border-blue-200',
  'bg-green-100 border-green-200',
  'bg-purple-100 border-purple-200',
];

// Fallback for demo purposes if localStorage is empty
export const INITIAL_BALANCE = 0;