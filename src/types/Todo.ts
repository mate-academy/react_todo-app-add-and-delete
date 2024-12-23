export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum FilterStatus {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export enum Errors {
  GET = 'Unable to load todos',
  EMPTY = 'Title should not be empty',
  POST = 'Unable to add a todo',
  DELETE = 'Unable to delete a todo',
  PATCH = 'Unable to update a todo',
}
