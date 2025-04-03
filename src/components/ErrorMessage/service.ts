import { ErrorType } from '../../types/Error';

export function getMessage(error: ErrorType) {
  switch (error.type) {
    case 'load':
      return 'Unable to load todos';
    case 'add':
      return 'Unable to add a todo';
    case 'delete':
      return 'Unable to delete a todo';
    case 'emptyTitle':
      return 'Title should not be empty';
    case 'update':
      return 'Unable to update todo';
    default:
      return '';
  }
}
