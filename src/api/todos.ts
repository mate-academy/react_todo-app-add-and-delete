import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
export const createTodo = ({
  id,
  userId,
  title,
  completed,
}: Todo) => {
  return client.post<Todo>('/todos', {
    id,
    userId,
    title,
    completed,
  });
};
