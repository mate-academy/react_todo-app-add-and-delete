import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1162;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const postTodos = (title: string) => {
  return client.post<Todo>(`/todos`, {
    userId: USER_ID,
    title,
    completed: false,
  });
};
