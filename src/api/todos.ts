import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = async (data: Partial<Todo>) => {
  return client.post('/todos', data);
};

export const updateTodos = (id: number, data: Partial<Todo>) => {
  return client.patch(`/todos/${id}`, data);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
