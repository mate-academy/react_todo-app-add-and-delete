export enum FilterTypes {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export enum ErrorTypes {
  def = '',
  OnLoadErr = 'Unable to load todos',
  OnEmptyTitleErr = 'Title should not be empty',
  OnAddErr = 'Unable to add a todo',
  OnDelErr = 'Unable to delete a todo',
  OnUpdErr = 'Unable to update a todo',
}
