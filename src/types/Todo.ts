export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum TodoStatus {
  All = 'all',
  Completed = 'completed',
  Active = 'active',
}
