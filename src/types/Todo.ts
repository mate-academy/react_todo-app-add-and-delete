export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export interface Todo {
  title: string,
  id: number,
  userId: number,
  completed: boolean,
}
