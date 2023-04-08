export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum Errors {
  LOADING = 'Unable to load todos',
  ADDING = 'Unable to add a todo',
  REMOVING = 'Unable to delete a todo',
  TITLE = 'Title cant be empty',
}
