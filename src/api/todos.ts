import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export type TodoData = Pick<Todo, 'userId' | 'title' | 'completed'>;

export const createTodo = async ({ userId, title, completed }: TodoData) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = async (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
