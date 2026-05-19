export type ErrorType =
  | 'unableToLoad'
  | 'titleInput'
  | 'unableToCreate'
  | 'unableToDelete'
  | 'unableToUpdate';

export const errorMessages: Record<ErrorType, string> = {
  unableToLoad: 'Unable to load todos',
  titleInput: 'Title should not be empty',
  unableToCreate: 'Unable to add a todo',
  unableToDelete: 'Unable to delete a todo',
  unableToUpdate: 'Unable to update a todo',
};
