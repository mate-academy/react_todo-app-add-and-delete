import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2046;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (data: Todo) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, data);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
