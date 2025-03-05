import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2377;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const createPost = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const updatePost = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};
