export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterTodos {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}
