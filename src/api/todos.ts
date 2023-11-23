import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const updateTodos = ({
  id, userId, title, completed,
}: Todo) => {
  const trimmedTitle = title.trim();

  return client.patch<Todo>(`/todos/${id}`, { userId, trimmedTitle, completed });
};
