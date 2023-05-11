/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/constants';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (data: any) => {
  return client.post(`/todos?userId=${USER_ID}`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: any) => {
  return client.patch(`/todos/${id}`, data);
};
