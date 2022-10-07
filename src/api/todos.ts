import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number | null) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = (userId: number | null, title: string) => {
  return client.post<Todo>('/todos/', {
    userId,
    completed: false,
    title,
  });
};

export const deleteTodo = (todoId: number | null) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
