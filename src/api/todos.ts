import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 901;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodos = ({ userId, completed, title }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, completed, title });
};

export const delateTodos = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const patchTodos = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
