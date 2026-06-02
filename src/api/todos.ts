import { Todo } from '../types/Todo';
import { client } from '../untils/fetchClient';

export const USER_ID = 4245;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getAll = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deletePost = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const updatePost = (todoId: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
