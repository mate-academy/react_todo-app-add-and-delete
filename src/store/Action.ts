/* eslint-disable prettier/prettier */
import { ActionTypes } from './ActionTypes';
import { Todo } from '../types/Todo';
import { ErrorTypes } from '../types/ErrorTypes';

export type Action =
  | {
    type: ActionTypes.LoadTodos;
    payload: { todos: Todo[] } | { error: ErrorTypes };
  }
  | {
    type: ActionTypes.CloseError;
  };
