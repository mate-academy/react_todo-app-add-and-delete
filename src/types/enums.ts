export enum FilterTypes {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export enum ErrorTypes {
  def = '',
  loadErr = 'Unable to load todos',
  titleErr = 'Title should not be empty',
  addErr = 'Unable to add a todo',
  delErr = 'Unable to delete a todo',
  updErr = 'Unable to update a todo',
}
