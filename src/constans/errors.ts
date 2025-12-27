export enum Errors {
  EmptyTitle = 'Title should not be empty',
  AddTodoFailed = 'Unable to add a todo',
  LoadTodosFailed = 'Unable to load todos',
  DeleteTodoFailed = 'Unable to delete a todo', // <-- тут додав 'a'
  DeleteCompletedFailed = 'Unable to delete completed todos',
  UpdateTodoFailed = 'Unable to update todo',
  ToggleAllFailed = 'Unable to toggle all todos',
}
