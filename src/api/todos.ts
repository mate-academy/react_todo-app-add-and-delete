import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2468;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newtTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newtTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
