import { Todo } from '../types/Todo';

import { client } from '../utils/fetchClient';

import { USER_ID } from '../constants/constants';

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (id: number): Promise<unknown> => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (
  id: number,
  updates: Partial<Todo>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, updates);
};
