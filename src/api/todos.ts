import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../vars/User';

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post('/todos', data);
};

export const updateTodo = (
  data: ({ id: number } & Partial<Todo>),
): Promise<Todo> => {
  return client.patch(`/todos/${data.id}`, data);
};

export const deleteTodo = (todoId: number): Promise<number> => {
  return client.delete(`/todos/${todoId}`);
};
