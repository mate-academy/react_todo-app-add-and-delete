export enum ErrorMessages {
  DEFAULT = '',
  LOAD_TODOS = 'Unable to load todos',
  ADDING_TODOS = 'Unable to add a todo',
  NAMING_TODOS = 'Title should not be empty',
  DELETING_TODOS = 'Unable to delete a todo',
  DELETING_SOME_TODOS = 'Unable to delete some todos',
  COMPLETED_TODOS = 'Unable to clear completed todos',
  UPDATE_TODOS = 'Unable to update a todo',
  TITLE_UPDATING_TODOS = 'Unable to update todo title',
}

export enum FilterStates {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}
