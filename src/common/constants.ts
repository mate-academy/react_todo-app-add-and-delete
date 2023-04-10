import { ErrorType } from '../types/ErrorType';

export const errorMessages: { [key in ErrorType]: string } = {
  [ErrorType.None]: '',
  [ErrorType.LoadTodos]: 'An error occurred while loading todos',
};
