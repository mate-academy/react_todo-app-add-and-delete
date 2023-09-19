import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deletePost = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodos = (todo: Omit<Todo, 'id'>) => {
  return client.patch<Todo>('/todos', todo);
};
