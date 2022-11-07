import { Todo } from '../types/Todo';
import { TodoTemplate } from '../types/TodoTemplate';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = ({
  userId,
  title,
  completed,
}: TodoTemplate) => {
  return client.post<Todo>('/todos', {
    userId,
    title,
    completed,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
