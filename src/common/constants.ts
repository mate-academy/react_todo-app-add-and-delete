import { ErrorType } from '../types/ErrorType';

export const errorMessages: { [key in ErrorType]: string } = {
  [ErrorType.None]: '',
  [ErrorType.LoadTodos]: 'An error occurred while loading todos',
  [ErrorType.AddTodo]: 'Unable to add a todo',
  [ErrorType.EmptyTitle]: 'Title can\'t be empty',
};
