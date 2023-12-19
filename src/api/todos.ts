import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (
  title: string, userId: number, completed: boolean,
): Promise<Todo> => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    title,
    userId,
    completed,
  });
};
