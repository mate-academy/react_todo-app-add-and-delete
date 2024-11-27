/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1889;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (data: any) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, data: any) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
