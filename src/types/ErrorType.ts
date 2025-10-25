export enum ErrorType {
  NoError = '',
  LoadTodosError = 'Unable to load todos',
  AddTodoError = 'Unable to add a todo',
  UpdateTodoError = 'Unable to update a todo',
  DeleteTodoError = 'Unable to delete a todo',
  EmptyTodoTitleError = 'Title should not be empty',
}
