export const TodoTypeErrors = {
  Unknown: 'Something when wrong',
  UnableToLoad: 'Unable to load todos',
  TitleShouldNotBeEmpty: 'Title should not be empty',
  UnableToAddTodo: 'Unable to add a todo',
  UnableToDeleteTodo: 'Unable to delete a todo',
  UnableToUpdateTodo: 'Unable to update a todo',
} as const;

export type TodoTypeError =
  (typeof TodoTypeErrors)[keyof typeof TodoTypeErrors];
