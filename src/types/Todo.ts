export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum TodoStatus{
  All = 'All',
  Completed = 'Completed',
  Uncompleted = 'Uncompleted',
}
