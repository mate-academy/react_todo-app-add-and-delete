import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 10215;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
