/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodos = (userId: number, data: any) => {
  return client.post(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (todeId: number) => {
  return client.delete(`/todos/${todeId}`);
};

export const patchTodo = (todoId: number, data: any) => {
  return client.patch(`/todos/${todoId}`, data);
};
