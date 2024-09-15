export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Status {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}
