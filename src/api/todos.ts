import { Todo } from '../types/Todo';
import { client } from '../utils/FetchClient';

export const USER_ID = 752;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodos = (title: string) => {
  const body = { userId: USER_ID, title: title, completed: false };

  return client.post<Todo>('/todos', body);
};
