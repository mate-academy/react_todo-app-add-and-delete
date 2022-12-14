export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export const enum TodoStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}
