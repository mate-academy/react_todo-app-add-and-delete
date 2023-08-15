export enum Error {
  ADD = 'add',
  DELETE = 'delete',
  UPDATE = 'update',
  NOTHING = '',
  FETCH = 'fetch',
  TITLE = 'title',
}

export const errorMapping = {
  [Error.ADD]: 'Unable to add a todo',
  [Error.DELETE]: 'Unable to delete a todo',
  [Error.UPDATE]: 'Unable to update a todo',
  [Error.FETCH]: 'Error with fetch todos request',
  [Error.TITLE]: 'Title can\'t be empty',
  [Error.NOTHING]: '',
};

export enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}
