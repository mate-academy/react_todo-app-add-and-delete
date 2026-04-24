export enum DefaultErrorMessages {
  NONE = '',
  FAILED_LOAD = 'Unable to load todos',
  EMPTY_TITLE = 'Title should not be empty',
  FAILED_ADD = 'Unable to add a todo',
  FAILED_DELETE = 'Unable to delete a todo',
  FAILED_UPDATE = 'Unable to update a todo',
}

export const UNEXPECTED_ERROR_PREFIX =
  'An unexpected error has occurred.' as const;

export type UnexpectedErrorMessage =
  `${typeof UNEXPECTED_ERROR_PREFIX}${string}`;

export type ErrorMessage = DefaultErrorMessages | UnexpectedErrorMessage;
