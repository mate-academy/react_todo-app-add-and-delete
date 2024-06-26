import { Todo } from './Todo';
import {
  HandleErrorClear,
  HandleFilterChange,
  HandleNewTodoInputChange,
  HandleTodoAdd,
  HandleTodoRemove,
} from './handlers';
import { TempTodo } from './types';

export type TodosContextValue = {
  todos: Todo[];
  tempTodo: TempTodo;
};

export type ErrorContextValue = {
  errorMessage: string;
  errorShown: boolean;
};

export type ApiContextValue = {
  handleNewTodoInputChange: HandleNewTodoInputChange;
  handleTodoAdd: HandleTodoAdd;
  handleTodoRemove: HandleTodoRemove;
  handleFilterChange: HandleFilterChange;
  handleErrorClear: HandleErrorClear;
};
