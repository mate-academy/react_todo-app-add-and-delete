import { Todo, TodosListType } from './todosTypes';

export type Actions = {
  type: 'LOAD',
  payload: TodosListType,
} | {
  type: 'POST',
  payload: Todo,
} | {
  type: 'DELETE',
  payload: number,
} | {
  type: 'PATCH',
  payload: Todo,
} | {
  type: 'IS_DELETING',
  payload: number,
} | {
  type: 'REMOVE_IS_DELETING',
  payload: number,
};
