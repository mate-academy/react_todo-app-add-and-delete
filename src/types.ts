export type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export type User = {
  id: number;
};

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export enum ErrorMessage {
  UnableToLoadTodos = 'Unable to load todos',
  UnableToAddTodo = 'Unable to add a todo',
  UnableToDeleteTodo = 'Unable to delete a todo',
  TitleShouldNotBeEmpty = 'Title should not be empty',
}
