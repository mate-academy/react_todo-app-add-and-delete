export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum SelectOption {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
