import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4293;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, updatedItem: Todo) => {
  return client.patch(`/todos/${todoId}`, updatedItem);
};
