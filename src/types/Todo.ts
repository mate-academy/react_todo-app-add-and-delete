export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum States {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export enum Error {
  Load = 'Unable to load todos',
  Title = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Remove = 'Unable to delete a todo',
  update = 'Unable to update a todo',
}
