/* eslint-disable @typescript-eslint/no-explicit-any */

import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2321;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Partial<Todo>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
