import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2253;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}}`, {
    title,
    completed,
    userId,
  });
};

export const deleteTodo = (itemId: number) => {
  return client.delete(`/todos/${itemId}`);
};

export const updateTodo = ({ id, title, completed, userId }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    title,
    completed: !completed,
    userId,
  });
};
