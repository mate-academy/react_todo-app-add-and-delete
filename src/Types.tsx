export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum SortType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}
