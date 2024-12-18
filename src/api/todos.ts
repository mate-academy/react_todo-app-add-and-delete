import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2161;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, completed }: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>('/todos', { title, completed, userId: USER_ID });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
