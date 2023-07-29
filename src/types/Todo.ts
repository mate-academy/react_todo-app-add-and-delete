export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Error {
  ADD = 'add',
  EMPTY = 'empty',
  DELETE = 'delete',
  UPDATE = 'update',
  NOTHING = '',
  FETCH = 'fetch',
}

export enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}
