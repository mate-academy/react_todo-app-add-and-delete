import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 897;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function createPost({ completed, title, userId }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { completed, title, userId });
}

export const deletePost = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

// Add more methods here
