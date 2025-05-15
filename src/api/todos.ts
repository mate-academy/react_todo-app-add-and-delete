import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (id: number) => {
  return client.get<Todo[]>(`/todos?userId=${id}`);
};

export const postTodos = (data: string) => {
  return client.post<Todo[]>(`/todos`, data);
};

export const patchTodos = (id: number, data: string) => {
  return client.patch<Todo[]>(`/todos${id}`, data);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
