export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum ErrorType {
  LOAD = 'Unable to load todos',
  TITLE = 'Title should not be empty',
  ADD = 'Unable to add a todo',
  DELETE = 'Unable to delete a todo',
  UPDATE = 'Unable to update a todo',
}
