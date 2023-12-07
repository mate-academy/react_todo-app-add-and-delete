import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({
  title,
  completed,
  userId,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos/', { title, userId, completed });
};

export const updateTodo = ({
  id,
  title,
  completed,
  userId,
}: Todo) => {
  return client.patch<Todo>(`todos/${id}`, { title, completed, userId });
};
