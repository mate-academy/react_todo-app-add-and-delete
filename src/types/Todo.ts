export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  loading?: boolean;
}
export enum FilterStatus {
  DEFAULT = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export enum ErrorMessage {
  DEFAULT = '',
  TODO_LOAD = 'Unable to load todos',
  TITLE_EMPTY = 'Title should not be empty',
  TODO_ADD = 'Unable to add a todo',
  TODO_DELETE = 'Unable to delete a todo',
  TODO_UPDATE = 'Unable to update a todo',
}
