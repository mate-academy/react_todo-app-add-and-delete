export enum ErrorMessages {
  None = '',
  ErrorLoadTodos = 'Unable to load todos',
  EroroTitle = "Title can't be empty",
  ErrorRemove = 'Unable to remove todo',
  ErrorAddTodo = 'Unable to add todo',
}

export type Error = {
  isError: boolean;
  message: ErrorMessages;
};
