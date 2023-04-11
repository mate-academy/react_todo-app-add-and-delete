export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum StatusToFilterBy {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
