import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4421;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const updateTodo = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { id, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const deleteCompleted = (completed: boolean) => {
  return client.delete(`/todos?completed=${completed}`);
};
