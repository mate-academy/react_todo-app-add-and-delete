import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = (userId: number, {
  title,
  completed = false,
}: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    title,
    completed,
    userId,
  });
};

export const deleteTodos = async (todoId: number): Promise<void> => {
  await client.delete(`/todos/${todoId}`);
};
