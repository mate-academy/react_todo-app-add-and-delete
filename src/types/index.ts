export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Filter {
  all = 'all',
  active = 'active',
  completed = 'completed',
}
