export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterStatus {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum ErrorMessages {
  DEFAULT = '',
  LOAD_TODOS = 'Unable to load todos',
  EMPTY_TITLE = 'Title should not be empty',
  ADD_TODO = 'Unable to add a todo',
  DELETE_TODO = 'Unable to delete a todo',
  UPDATE_TODO = 'Unable to update a todo',
}
