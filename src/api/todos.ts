import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 456;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string, completed: boolean) => {
  return client.post<Todo>(`/todos`, { title, userId: USER_ID, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
