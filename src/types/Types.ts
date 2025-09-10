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

export enum ErrorType {
  None = '',
  СantLoad = 'Unable to load todos',
  TitleEmpty = 'Title should not be empty',
  CantAdd = 'Unable to add a todo',
  CantDelete = 'Unable to delete a todo',
}

export type LoadedTodo = {
  isLoad: boolean;
  id: number | null;
};
