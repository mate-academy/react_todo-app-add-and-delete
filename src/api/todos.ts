import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1905;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete<number>(`/todos/${id}?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, {
    userId: USER_ID,
    title: title,
    completed: false,
  });
};
