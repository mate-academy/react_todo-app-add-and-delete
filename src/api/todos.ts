import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3745;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({ id, title, completed }: Omit<Todo, 'userId'>) => {
  return client.patch<Todo>(`/todos/${id}`, { id, title, completed });
};
