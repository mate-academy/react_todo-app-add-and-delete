import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 893;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const loadTodos = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};
