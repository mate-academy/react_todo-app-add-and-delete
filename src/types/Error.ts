export type ErrorMessage =
  | ''
  | 'load'
  | 'emptyTitle'
  | 'add'
  | 'delete'
  | 'update';

export type ErrorType = {
  isVisible: boolean;
  type: ErrorMessage;
};
