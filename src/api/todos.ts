import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2431;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = ({ userId, title }: Omit<Todo, 'completed' | 'id'>) => {
  const body = { userId, title, completed: false };

  return client.post<Todo>('/todos', body);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
