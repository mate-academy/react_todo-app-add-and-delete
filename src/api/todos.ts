import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1092;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const postTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    userId: USER_ID,
    title: title,
    completed: false,
  });
};

export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
