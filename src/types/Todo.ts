export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum TodoStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
