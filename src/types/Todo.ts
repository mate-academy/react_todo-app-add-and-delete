export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum StatusFilterValue {
  All = 'all',
  Complited = 'completed',
  Active = 'active',
}

export enum ErrorMessages {
  TodosLoad = 'Unable to load todos',
  TitleIsEmpty = 'Title should not be empty',
  AddTodo = 'Unable to add a todo',
  DeleteTodo = 'Unable to delete a todo',
  UpdateTodo = 'Unable to update a todo',
}

export interface PostTodo {
  userId: number;
  title: string;
  completed: boolean;
}
