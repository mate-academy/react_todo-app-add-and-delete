import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3286;

export const getTodos = async (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const newTodo = {
    ...todo,
    userId: USER_ID,
  };

  return client.post<Todo>('/todos', newTodo);
};

export const updateTodo = async (
  id: number,
  updates: Partial<Todo>,
): Promise<void> => {
  await client.patch(`/todos/${id}`, updates);
};

export const removeTodo = async (id: number): Promise<void> => {
  await client.delete(`/todos/${id}`);
};
