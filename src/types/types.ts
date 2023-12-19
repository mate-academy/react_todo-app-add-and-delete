export type Data = {
  completed: boolean;
};

export enum FilterBy {
  All,
  Active,
  Completed,
}

export enum ErrorMessage {
  Load = 'Unable to load todos',
  NotBeEmpty = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}
