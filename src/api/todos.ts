import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = import.meta.env.VITE_USER_ID;

const userId = USER_ID;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = (title: string) => {
  return client.post<Todo>(`/todos`, { title, userId, completed: false });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
// Add more methods here
