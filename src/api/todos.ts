import { Todo } from '../types/Todo';
import { TodoFromServer } from '../types/state';
import { client } from '../utils/fetchClient';

export const USER_ID = 543;

export const getTodos = () => {
  return client.get<TodoFromServer[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: Todo) => {
  return client.post<TodoFromServer>(`/todos`, data);
};

export const updateTodo = (id: number, data: Partial<TodoFromServer>) => {
  return client.patch<TodoFromServer>(`/todos/${id}`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
