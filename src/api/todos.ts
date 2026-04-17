import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4135;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const updateTodo = (
  id: number,
  data: Partial<Omit<Todo, 'id' | 'userId'>>,
) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
