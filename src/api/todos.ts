import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3383;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    userId: USER_ID,
    title: title,
    completed: false,
  });
};

export const patchTodo = (id: number, todo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`).then(() => id);
};
