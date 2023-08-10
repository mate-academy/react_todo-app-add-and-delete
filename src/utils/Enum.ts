export enum Error {
  ADD = 'add',
  DELETE = 'delete',
  UPDATE = 'update',
  NOTHING = '',
  FETCH = 'fetch',
  TITLE = 'title',
}

export enum ErrorText {
  ADD = 'Unable to add a todo',
  DELETE = 'Unable to delete a todo',
  UPDATE = 'Unable to update a todo',
  FETCH = 'Error with fetch todos request',
  TITLE = 'Title can\'t be empty',
}

export enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}
