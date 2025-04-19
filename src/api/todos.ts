import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID: number = import.meta.env.VITE_USER_ID;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
