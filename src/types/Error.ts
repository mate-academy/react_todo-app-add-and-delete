export enum ErrorMessages {
  unableToloadTodos = 'Unable to load todos',
  emptyTitle = 'Title should not be empty',
  unableToAddTodo = 'Unable to add a todo',
  unableToDelete = 'Unable to delete a todo',
  unableToUpdate = 'Unable to update a todo',
}

export interface Errors {
  newError: ErrorMessages | null,
  setNewError: React.Dispatch<React.SetStateAction<ErrorMessages | null>>,
  showError: boolean,
  setShowError: React.Dispatch<React.SetStateAction<boolean>>,
}
