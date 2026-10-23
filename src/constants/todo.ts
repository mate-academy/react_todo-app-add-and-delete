export const FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
} as const;

export type Status = (typeof FILTERS)[keyof typeof FILTERS];

export const TODO_MESSAGES = {
  emptyTitle: 'Title should not be empty',
  unableToAdd: 'Unable to add a todo',
  unableToDelete: 'Unable to delete a todo',
  unableToLoad: 'Unable to load todos',
} as const;
