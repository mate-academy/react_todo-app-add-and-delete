import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2464;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', {
    title,
    completed,
    userId,
  });
};

export const updateTodo = ({ id, title, completed, userId }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    title,
    completed,
    userId,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
