export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export enum ErrorMessage {
  UnableLoadTodos = 'Unable to load todos',
  TitleEmpty = 'Title should not be empty',
  UnableAddTodo = 'Unable to add a todo',
  UnableDeleteTodo = 'Unable to delete a todo',
}
