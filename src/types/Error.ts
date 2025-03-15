export const ERROR = {
  noError: 'noError',
  couldntLoadTodos: 'couldntLoadTodos',
  noTitle: 'noTitle',
  unableToAdd: 'unableToAdd',
  unableToDelete: 'unableToDelete',
  unableToUpdate: 'unableToUpdate',
} as const;

export type ErrorType = (typeof ERROR)[keyof typeof ERROR];
