import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string, userId: number) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoID: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoID}`, data);
};
