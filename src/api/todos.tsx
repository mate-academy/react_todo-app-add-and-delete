import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3854;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string, userId: number) => {
  return client.post<Todo>('/todos', { title, userId, completed: false });
};

export const deletePost = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const updateTodo = (id: number, updates: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, updates);
};
