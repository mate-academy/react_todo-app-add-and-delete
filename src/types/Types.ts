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

export enum ErrorMessage {
  LOAD = 'Unable to load todos',
  DELETE = 'Unable to delete a todo',
}
