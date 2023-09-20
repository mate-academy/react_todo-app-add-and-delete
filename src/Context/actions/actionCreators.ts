import { TodosListType, Todo } from '../../types/todosTypes';
import { Actions } from '../../types/actionTypes';

export const loadTodosAction = (data: TodosListType): Actions => ({
  type: 'LOAD',
  payload: data,
});

export const postTodoAction = (data: Todo): Actions => ({
  type: 'POST',
  payload: data,
});

export const deleteTodoAction = (data: number): Actions => ({
  type: 'DELETE',
  payload: data,
});

export const setIsDeletingAction = (data: number): Actions => ({
  type: 'IS_DELETING',
  payload: data,
});

export const removeIsDeletingAction = (data: number): Actions => ({
  type: 'REMOVE_IS_DELETING',
  payload: data,
});
