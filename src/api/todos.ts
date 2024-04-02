import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 378;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', {
    userId,
    title,
    completed,
  });
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
