import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoFromServer } from '../types/TodoFromServer';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = ({ userId, title, completed }: TodoFromServer) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const updateTodos = ({
  id, userId, completed, title,
}: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, completed, title });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
