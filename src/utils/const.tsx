import { Todo } from '../types/Todo';

export const errorMessages = {
  loadingError: 'Unable to load todos',
  emptyError: 'Title should not be empty',
  addingError: 'Unable to add a todo',
  deleteError: 'Unable to delete a todo',
  updateError: 'Unable to update a todo',
};

export const TEMP_TODO: Omit<Todo, 'title'> = {
  id: 0,
  userId: 1318,
  completed: false,
};
