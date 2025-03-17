import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2412;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (data: Todo) => {
  return client.post<Todo>(`/todos`, data);
};

export const updateTodos = (data: Todo) => {
  return client.patch<Todo>(`/todos/${data.id}`, data);
};

export const deleteTodo = (data: Todo) => {
  return client.delete(`/todos/${data.id}`);
};
