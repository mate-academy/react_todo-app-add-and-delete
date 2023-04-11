export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum StatusToFilter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export interface Newtodo {
  title: string,
  userId: number,
  completed: boolean,
}
