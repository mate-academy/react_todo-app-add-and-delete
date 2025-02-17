import { FilterField } from './FilterField';
import { Todo } from './Todo';

export enum ActionType {
  SetTodos = 'setTodos',
  SetFilterField = 'setFilterField',
  AddTodo = 'addTodo',
  DeleteTodo = 'deleteTodo',
  SetErrorMessage = 'setErrorMessage',
  ClearErrorMessage = 'clearErrorMessage',
}

export interface State {
  todos: Todo[];
  filterField: FilterField;
  errorMessage: string;
}

export type Action =
  | { type: ActionType.SetTodos; payload: Todo[] }
  | { type: ActionType.SetFilterField; payload: FilterField }
  | { type: ActionType.AddTodo; payload: Todo }
  | { type: ActionType.DeleteTodo; payload: number }
  | { type: ActionType.SetErrorMessage; payload: string }
  | { type: ActionType.ClearErrorMessage };
