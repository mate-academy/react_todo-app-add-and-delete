import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2952;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { ...newTodo, userId: USER_ID });
};

export const updateTodo = (id: string, updatedTodo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, updatedTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
