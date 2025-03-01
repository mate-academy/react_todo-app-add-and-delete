import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

export const USER_ID = 2283;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (data: Todo) => {
  return client.post<Todo>(`/todos`, data);
};

export const removeTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodos = (id: number, data: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
