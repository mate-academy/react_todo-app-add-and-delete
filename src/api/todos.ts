import { Todo, TodoToSend } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 6623;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (data: TodoToSend) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
