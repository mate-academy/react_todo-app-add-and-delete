import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTodo = (data: any) => {
  return client.post<Todo>('/todos', data);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
