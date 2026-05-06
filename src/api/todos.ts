import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4175;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

type NewTodo = {
  title: string;
  userId: number;
  completed: boolean;
};

export const postTodos = (data: NewTodo): Promise<Todo> => {
  return client.post<Todo>(`/todos`, data);
};

export const patchTodos = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
