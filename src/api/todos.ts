import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 583;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const setPost = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deletePost = (url: string) => {
  return client.delete(url);
};

// Add more methods here
