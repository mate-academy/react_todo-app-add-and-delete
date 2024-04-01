import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 255;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const createTodos = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
