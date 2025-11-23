export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type Filter = 'all' | 'active' | 'completed';
