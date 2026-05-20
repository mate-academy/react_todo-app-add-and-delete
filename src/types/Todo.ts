export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Filters {
  all = 'all',
  completed = 'completed',
  active = 'active',
}
