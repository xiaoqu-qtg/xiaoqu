export interface Roommate {
  id: string;
  name: string;
  avatar: string; // Color code or image URL placeholder
}

export interface Duty {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  roommateId: string;
  task: string;
  isCompleted: boolean;
}

export interface Transaction {
  id: string;
  payerId: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'contribution';
}

export type ViewState = 'dashboard' | 'duty' | 'money' | 'games' | 'assistant';

export enum GameType {
  TRUTH_DARE = 'TRUTH_DARE',
  WHO_IS_SPY = 'WHO_IS_SPY',
  ADVENTURE = 'ADVENTURE'
}