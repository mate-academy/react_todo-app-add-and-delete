import { Todo } from '../types/Todo';
import { client } from '../untils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = (userId: number, {
  title,
  completed = false,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    title,
    completed,
    userId,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
