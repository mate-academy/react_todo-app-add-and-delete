import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 462;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deletePost = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const addPost = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};
