export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Status {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
