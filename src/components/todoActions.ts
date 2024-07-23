import { ActionType, Action } from '../types/Actions';
import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';

export const setInputFocuseAction = (isInputFocused: boolean): Action => ({
  type: ActionType.SetIsInputFocused,
  payload: isInputFocused,
});

export const setErrorMessageAction = (message: string): Action => ({
  type: ActionType.SetErrorMessage,
  payload: message,
});

export const setFilterAction = (filter: FilterStatus): Action => ({
  type: ActionType.SetFilter,
  payload: filter,
});

export const setTodosAction = (todos: Todo[]): Action => ({
  type: ActionType.SetTodos,
  payload: todos,
});

export const setTempTodoAction = (tempTodo: Todo | null): Action => ({
  type: ActionType.SetTempTodo,
  payload: tempTodo,
});

export const deleteTodoAction = (todoId: number): Action => ({
  type: ActionType.DeleteTodo,
  payload: todoId,
});

export const setCurrentlyLoadingItemsIdsAction = (
  currentlyLoadingItemsIds: number[],
): Action => ({
  type: ActionType.SetCurrentlyLoadingItemsIds,
  payload: currentlyLoadingItemsIds,
});
