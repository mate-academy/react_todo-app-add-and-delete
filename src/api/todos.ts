import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1609;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo[]>(`/todos`, { title, completed, userId });
};

export const deleteTodo = (id: Todo['id']) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
