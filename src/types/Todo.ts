export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const ERRORS = {
  LOAD: 'Unable to load todos',
  ADD: 'Unable to add a todo',
  DELETE: 'Unable to delete a todo',
  UPDATE: 'Unable to update a todo',
  EMPTY_TITLE: 'Title should not be empty',
};
