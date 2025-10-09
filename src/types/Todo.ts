export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type InitialTodo = Pick<Todo, 'title' | 'userId' | 'completed'>;

export enum TodoFilterMethod {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
  Default = All,
}
