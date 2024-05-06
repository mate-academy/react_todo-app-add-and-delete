export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type Status = 'all' | 'active' | 'completed';

export type Error = 'load' | 'empty' | 'add' | 'delete' | 'update';
