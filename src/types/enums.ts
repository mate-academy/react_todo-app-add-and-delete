export enum Status {
  'All' = 'All',
  'Active' = 'Active',
  'Completed' = 'Completed',
}

export enum State {
  Edit = 'edit',
  Loading = 'loading',
  Active = 'active',
}

export enum TodoError {
  UnableToLoad = 'Unable to load todos',
  NoTitle = 'Title should not be empty',
  UnableToAdd = 'Unable to add a todo',
  UnableToDelete = 'Unable to delete a todo',
  UnableUpdate = 'Unable to update a todo',
}
