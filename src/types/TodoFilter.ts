export enum TodosFilter {
  all,
  active,
  completed,
}

export enum TodoError {
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  update = 'Unable to update a todo',
  empty = 'Title can not be empty',
  noerror = '',
}
