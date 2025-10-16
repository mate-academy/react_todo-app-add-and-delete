import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = '3509';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const updateTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const deletedTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
