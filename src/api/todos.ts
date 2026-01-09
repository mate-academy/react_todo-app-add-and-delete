import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3691;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function addPost(post: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', post);
}

export function updatePost(post: Todo) {
  return client.patch<Todo>(`/todos/${post.id}`, post);
}

export function deletePost(postId: number) {
  return client.delete(`/todos/${postId}`);
}
