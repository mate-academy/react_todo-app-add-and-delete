export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Status {
  all = 'all',
  completed = 'completed',
  active = 'active',
}

export enum ErrorMessage {
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
  TitleEmpty = 'Title should not be empty',
}
