import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 472;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = ({ userId, title, completed }: Partial<Todo>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, {
    id: 0,
    userId,
    title,
    completed,
  });
};

export const patchTodo = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
