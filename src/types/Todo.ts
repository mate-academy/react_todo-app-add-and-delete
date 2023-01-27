export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum TodoCompleteStatus {
  All = 0,
  Active = 1,
  Completed = 2,
}
