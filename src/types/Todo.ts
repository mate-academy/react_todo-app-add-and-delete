export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum StatusSelect {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
