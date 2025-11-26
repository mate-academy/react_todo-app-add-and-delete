export const FILTER_TYPE = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const ERROR_TYPE = {
  LOAD: 'loadError',
  TITLE: 'titleError',
  ADD: 'addError',
  DELETE: 'deleteError',
  UPDATE: 'updateError',
  NONE: 'none',
} as const;
