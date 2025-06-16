export enum FilterParams {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export enum ErrorMessages {
  None = '',
  OnEmptyTitle = 'Title should not be empty',
  OnGet = 'Unable to load todos',
  OnPost = 'Unable to add a todo',
  OnDelete = 'Unable to delete a todo',
  OnPatch = 'Unable to update a todo',
}
