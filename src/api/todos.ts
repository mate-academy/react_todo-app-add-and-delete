import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3542;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string, userId: number): Promise<Todo> => {
  return client.post('/todos', { title, userId, completed: false });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export enum ErrorMessages {
  ADD_TODO = 'Unable to add a todo',
  DELETE_TODO = 'Unable to delete a todo',
  UPDATE_TODO = 'Unable to update a todo',
  LOAD_TODOS = 'Unable to load todos',
}
