export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Errors {
  Load = 'Unable to load todos',
  EmptyTitle = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}

export enum SelectedTasks {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}
