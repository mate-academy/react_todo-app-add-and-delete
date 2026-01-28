import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3866;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const createTodo = (
  data: Pick<Todo, 'title' | 'userId' | 'completed'>,
) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
