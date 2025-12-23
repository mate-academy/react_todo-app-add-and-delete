export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}
