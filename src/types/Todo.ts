export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum TodoStatusFilter {
  All = 'All',
  Completed = 'Completed',
  Active = 'Active',
}
