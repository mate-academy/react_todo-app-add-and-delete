import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 253;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

// Add more methods here
