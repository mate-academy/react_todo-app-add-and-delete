import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodos = (todoId: number) => {
  return client.get<Todo[]>(`/todos/${todoId}`);
};

export const addTodos = ({
  title,
  userId,
  completed,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};
