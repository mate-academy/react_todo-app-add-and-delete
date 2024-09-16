import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1437;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const postTodos = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};
