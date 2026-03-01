export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export enum ErrorMessage {
  Fetch = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  EmptyTitle = 'Title should not be empty',
  Update = 'Unable to update a todo',
}
