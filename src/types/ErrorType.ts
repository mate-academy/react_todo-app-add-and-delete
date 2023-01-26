export enum ErrorType {
  None = '',
  LoadingError = 'No todos were loaded!',
  InsertionError = 'Unable to add a todo',
  RemovalError = 'Unable to delete a todo',
  ModificationError = 'Unable to update a todo',
  TitleError = 'Title can\'t be empty',
}
