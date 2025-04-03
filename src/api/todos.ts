import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2550;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function addPost(title: string) {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
}

export function deletePost(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}
