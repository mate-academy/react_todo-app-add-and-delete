import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1590;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Partial<Todo>) =>
  client.post<Todo>('/todos', todo);

export const updateTodo = (id: number, data: Partial<Todo>) =>
  client.patch<Todo>(`/todos/${id}`, data);

export const deleteTodo = (id: number) => client.delete(`/todos/${id}`);
