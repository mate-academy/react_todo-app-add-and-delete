export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterType {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
