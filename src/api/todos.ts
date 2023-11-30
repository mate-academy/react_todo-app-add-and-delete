import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updatedTodo = ({
  id, title, completed, userId,
}: Todo) => {
  const trimmedTitle = title.trim();

  return client.patch<Todo>(`/todos/${id}`, { trimmedTitle, completed, userId });
};
