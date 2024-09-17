import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 260;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (data: Todo) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodos = (todosId: number) => {
  return client.delete(`/todos/${todosId}`);
};

export const updateTodos = (todosId: number, data: Todo) => {
  return client.patch<Todo>(`/todos/${todosId}`, data);
};
// Add more methods here
