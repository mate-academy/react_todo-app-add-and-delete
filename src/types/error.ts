export enum ErrorMessage {
  Null = 'NONE',
  LoadingTodos = 'UNABLE_TO_LOAD_TODOS',
  EmptyTitle = 'TITLE_SHOULD_NOT_BE_EMPTY',
  AddingTodo = 'UNABLE_TO_ADD_A_TODO',
  DeletingTodo = 'UNABLE_TO_DELETE_A_TODO',
  UpdatingTodo = 'UNABLE_TO_UPDATE_A_TODO',
}

export const ERROR_MESSAGES: Record<ErrorMessage, string> = {
  [ErrorMessage.Null]: '',
  [ErrorMessage.LoadingTodos]: 'Unable to load todos',
  [ErrorMessage.EmptyTitle]: 'Title should not be empty',
  [ErrorMessage.AddingTodo]: 'Unable to add a todo',
  [ErrorMessage.DeletingTodo]: 'Unable to delete a todo',
  [ErrorMessage.UpdatingTodo]: 'Unable to update a todo',
};
