export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type Filter = 'All' | 'Active' | 'Completed';

export enum ErrorType {
  LoadTodos = 'Unable to load todos',
  TitleEmpty = 'Title should not be empty',
  AddTodo = 'Unable to add a todo',
  DeleteTodo = 'Unable to delete a todo',
  UpdateTodo = 'Unable to update a todo',
}
