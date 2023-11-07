import { Todo } from '../types/Todo';

export const USER_ID = 11822;

export enum ActionState {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const initialValue: Context = {
  todos: [],
  filterTodos: ActionState.ALL,
  setFilterTodos: () => { },
  visibleTodos: [],
  errorMessage: '',
  setErrorMessage: () => { },
  dispatch: () => { },
};

export interface Context {
  todos: Todo[],
  filterTodos: ActionState,
  setFilterTodos: (val: ActionState) => void,
  visibleTodos: Todo[],
  errorMessage: string,
  setErrorMessage: (val: string) => void,
  dispatch: any,
}

export enum ErrorType {
  Loading = 'Title should not be empty',
  CreateTodo = 'Unable to add a todo',
  DeleteTodo = 'Unable to delete a todo',
  UpdateTodo = 'Unable to update a todo',
}
