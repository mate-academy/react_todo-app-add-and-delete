export const errorMessages = {
  load: 'Unable to load todos',
  title: 'Title should not be empty',
  add: 'Unable to add a todo',
  delete: 'Unable to delete a todo',
  update: 'Unable to update a todo',
} as const;

export type ErrorMessages = (typeof errorMessages)[keyof typeof errorMessages];
