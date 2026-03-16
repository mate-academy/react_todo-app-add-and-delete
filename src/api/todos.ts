import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4078;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};
// Add more methods here

export function addPost(post: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', post);
}

export function deletePost(postId: number) {
  return client.delete(`/todos/${postId}`);
}
