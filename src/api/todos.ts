import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2533;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const createTodos = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
};
