export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export type TodoBase = Omit<Todo, 'id'>;

export const FILTER = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export type Filter = (typeof FILTER)[keyof typeof FILTER];

export const FILTER_LINKS = [
  [FILTER.ALL, 'All'],
  [FILTER.ACTIVE, 'Active'],
  [FILTER.COMPLETED, 'Completed'],
] as const;

export type FilterLinkTuple = (typeof FILTER_LINKS)[number];

export enum ErrorType {
  LOAD_TODOS = 'Unable to load todos',
  EMPTY_TITLE = 'Title should not be empty',
  ADD_TODO = 'Unable to add a todo',
  DELETE_TODO = 'Unable to delete a todo',
  UPDATE_TODO = 'Unable to update a todo',
}
