/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (uri: string) => {
  return client.get<Todo[]>(`/todos${uri}`);
};

export const addTodos = (uri: string, data: any) => {
  return client.post<Todo>(`/todos${uri}`, data);
};

export const deleteTodos = (uri: string) => {
  return client.delete(`/todos${uri}`);
};

export const updateTodos = (uri: string, data: any) => {
  return client.patch(`/todos${uri}`, data);
};
