import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Omit<Todo, 'id'>>('/todos', todo);
};

export const removeTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
