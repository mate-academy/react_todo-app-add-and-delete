export enum ErrorType {
  load = 'load',
  title = 'title',
  add = 'add',
  delete = 'delete',
  update = 'update',
}

export const errorMessages = {
  [ErrorType.load]: 'Unable to load todos',
  [ErrorType.title]: 'Title should not be empty',
  [ErrorType.add]: 'Unable to add a todo',
  [ErrorType.delete]: 'Unable to delete a todo',
  [ErrorType.update]: 'Unable to update a todo',
} as const;

export type ErrorMessageKey = keyof typeof errorMessages;
export type ErrorMessages = (typeof errorMessages)[ErrorMessageKey];
