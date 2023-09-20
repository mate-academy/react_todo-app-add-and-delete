import { Todo, TodosListType } from './todosTypes';

export type Actions = {
  type: 'LOAD',
  payload: TodosListType,
} | {
  type: 'ADD',
  payload: Todo,
};
