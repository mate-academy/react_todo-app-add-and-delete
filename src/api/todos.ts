import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, newTodo: unknown): Promise<Todo> => {
  return client.post<Todo>(`/todos?userId=${userId}`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
