import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3622;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, updates: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, updates);
};
