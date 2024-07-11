import { Status } from './Status';
import { Todo } from './Todo';

export enum Type {
  AddTodo = 'addTodo',
  ToggleAllChecked = 'toggleAllChecked',
  ClearCompleted = 'clearCompleted',
  UpdateTodo = 'updateTodo',
  UpdateTodoCheckStatus = 'updateTodoCheckStatus',
  DeleteTodo = 'deleteTodo',
  setStatus = 'setStatus',
  setTitle = 'setTitle',
  setEditingId = 'setEditingId',
  setLoading = 'setLoading',
  setErrorMessage = 'setErrorMessage',
  setTodos = 'setTodos',
  setIsSubmitting = 'setIsSubmitting',
  setTempTodo = 'setTempTodo',
  setDeletedTodos = 'setDeletedTodos',
  resetDeletedTodos = 'resetDeletedTodos',
}

export type Action =
  | { type: Type.ToggleAllChecked }
  | { type: Type.ClearCompleted }
  | { type: Type.AddTodo; payload: Todo }
  | { type: Type.UpdateTodo; payload: Todo }
  | { type: Type.UpdateTodoCheckStatus; payload: Todo }
  | { type: Type.DeleteTodo; payload: Todo }
  | { type: Type.setStatus; payload: Status }
  | { type: Type.setEditingId; payload: number | undefined }
  | { type: Type.setTitle; payload: string }
  | { type: Type.setTodos; payload: Todo[] }
  | { type: Type.setErrorMessage; payload: string }
  | { type: Type.setLoading; payload: boolean }
  | { type: Type.setIsSubmitting; payload: boolean }
  | { type: Type.setTempTodo; payload: Todo | null }
  | { type: Type.setDeletedTodos; payload: Todo }
  | { type: Type.resetDeletedTodos; payload: Todo };
