export enum IsActiveLink {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export enum IsActiveError {
  NoError = '',
  Load = 'Unable to load todos',
  Empty = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}
