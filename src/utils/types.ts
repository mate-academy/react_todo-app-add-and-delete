export enum ErrorMessage {
  LOAD_TODOS = 'Unable to load todos',
  EMPTY_TITLE = 'Title should not be empty',
  ADD_TODO = 'Unable to add a todo',
  DELETE_TODO = 'Unable to delete a todo',
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export const FILTERS = {
  all: 'all',
  active: 'active',
  completed: 'completed',
} as const;

export type FilterType = (typeof FILTERS)[keyof typeof FILTERS];
