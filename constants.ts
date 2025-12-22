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

// Fallback for demo purposes if localStorage is empty
export const INITIAL_BALANCE = 0;