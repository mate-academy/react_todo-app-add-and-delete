import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number | undefined) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number | undefined, query: string) => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    userId,
    completed: false,
    title: query,
  });
};

export const deleteTodo = (todoID: number) => {
  return client.delete(`/todos/${todoID}`);
};

export const updateTodo = (todoId: number, object: unknown): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, object);
};
