export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum StatusFilter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export enum MessageError {
  loading = 'Unable to load todos',
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  title = 'Title should not be empty',
  SomethingWentWrong = 'Something went wrong',
}
