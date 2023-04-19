export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type SendedTodo = Omit<Todo, 'id'>;

export type LoadTodos = () => void;

export enum FILTERS {
  all = 'All',
  completed = 'Completed',
  active = 'Active',
}
