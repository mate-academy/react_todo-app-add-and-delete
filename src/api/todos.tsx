/* eslint-disable @typescript-eslint/no-explicit-any */
import { TodoType } from '../types/TodoType';
import { client } from '../utils/fetchClient';

export const USER_ID = 6535;

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

export const createTodo = (data: any) => {
  return client.post<TodoType>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
