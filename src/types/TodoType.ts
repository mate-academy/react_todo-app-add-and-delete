export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum ErrorMessage {
  noTodos = 'Unable to load todos',
  noTitle = 'Title should not be empty',
  noAddTodo = 'Unable to add a todo',
  noDeleteTodo = 'Unable to delete a todo',
  noUpdateTodo = 'Unable to update a todo',
}

export type Filter = 'All' | 'Active' | 'Completed';
