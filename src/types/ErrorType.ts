export enum ErrorType {
  LOAD_TODOS_FAILED = 'Unable to load todos',
  EMPTY_TITLE = 'Title should not be empty',
  ADD_TODO_FAILED = 'Unable to add a todo',
  DELETE_TODO_FAILED = 'Unable to delete a todo',
  UPDATE_TODO_FAILED = 'Unable to update a todo',
  // eslint-disable-next-line max-len
  CLEAR_COMPLETED_FAILED = 'Failed to delete some completed todos. Please try again.',
}
