import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 6676;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};
/* eslint-disable-next-line */
export const postTodo = (userId: number, data: any) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (userId: number, idTodo: number) => {
  return client.delete(`/todos/${idTodo}?userId=${userId}`);
};
