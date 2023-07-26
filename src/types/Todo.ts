export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterBy {
  ALL = 'all',
  COMPLETED = 'completed',
  ACTIVE = 'active',
}
