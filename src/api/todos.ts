import type { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4585;

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number): Promise<unknown> => {
  return client.delete(`/todos/${todoId}`);
};
