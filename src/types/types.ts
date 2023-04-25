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

export enum ErrorTypes {
  none = '',
  get = 'unable to get todos',
  add = 'unable to add todo',
  delete = 'unable to delete a todo',
  emptyTitle = "the title can't be empty",
}
