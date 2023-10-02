export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type Filter = 'All' | 'Active' | 'Completed';
