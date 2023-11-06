import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: Omit<Todo, 'id'>, userId: number) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (id: number, userId: number) => {
  return client.delete(`/todos/${id}?userId=${userId}`);
};
