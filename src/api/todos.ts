import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const createTodo = (userId: number, data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
