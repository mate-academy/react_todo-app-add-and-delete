import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (
  title: string, userId: number, completed: boolean,
): Promise<Todo> => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    title,
    userId,
    completed,
  });
};

export const removeTodo = (todoId: number, userId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};
