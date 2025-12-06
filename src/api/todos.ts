import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3687;

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = (id: number, data: Partial<Todo>): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const deleteTodo = (id: number): Promise<void> => {
  return client.delete(`/todos/${id}`) as Promise<void>;
};
