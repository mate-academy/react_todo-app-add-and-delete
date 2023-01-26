export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterTodoComplete {
  All = 0,
  Active = 1,
  Completed = 2,
}
