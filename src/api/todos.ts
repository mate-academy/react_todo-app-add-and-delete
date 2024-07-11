import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 790;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
