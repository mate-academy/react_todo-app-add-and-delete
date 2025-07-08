export enum ErrorTypes {
  LOAD_TODOS_FAILED = 'Unable to load todos',
  EMPTY_TITLE = 'Title should not be empty',
  ADD_TODO_FAILED = 'Unable to add a todo',
  DELETE_TODO_FAILED = 'Unable to delete a todo',
  CLEAR_COMPLETED_FAILED = 'Failed to delete some completed todos. ' +
    'Please try again.',
}
