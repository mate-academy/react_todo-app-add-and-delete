export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export type ErrorType = {
  load: boolean;
  titleEmpty: boolean;
  deleteTodo: boolean;
};
