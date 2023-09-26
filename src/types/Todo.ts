export type Filter = 'All' | 'Active' | 'Completed';

export enum ErrorMessageEnum {
  noTodos = 'Unable to load todos',
  emptyTitle = 'Title should not be empty',
  noPostTodo = 'Unable to add a todo',
  noUpdateTodo = 'Unable to update a todo',
  noDeleteTodo = 'Unable to delete a todo',
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}
