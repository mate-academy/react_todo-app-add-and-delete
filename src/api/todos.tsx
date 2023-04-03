import { Todo } from '../types/Todo';
import { request } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return request<Todo[]>(`/todos?userId=${userId}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addTodos = (url: string, data: any) => {
  return request<Todo>(url, 'POST', data);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const changeTodo = (url: string, data: any) => {
  return request<Todo>(url, 'PATCH', data);
};

export const deleteTodos = (url: string) => {
  return request(url, 'DELETE');
};
