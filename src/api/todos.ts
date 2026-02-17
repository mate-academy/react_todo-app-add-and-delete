import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3958;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodos = (title: string) => {
  return client.post<Todo>(`/todos`, {
    title,
    completed: false,
    userId: USER_ID,
  });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
