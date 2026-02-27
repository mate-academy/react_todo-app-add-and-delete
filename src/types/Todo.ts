export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export enum Filter {
  all = 'all',
  active = 'active',
  completed = 'completed',
}
