export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum StatusSelect {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export interface ITempTodo {
  isLoading: boolean;
  todo: Omit<Todo, 'userId'> | null;
}
