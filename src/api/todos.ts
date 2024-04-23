import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 476;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const updateTodo = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
