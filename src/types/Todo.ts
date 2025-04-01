export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoInput = Omit<Todo, 'id'>;

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
