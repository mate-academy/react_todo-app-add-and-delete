import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2359;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const apiAddTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (
  id: number,
  updates: Partial<Todo>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, updates);
};
