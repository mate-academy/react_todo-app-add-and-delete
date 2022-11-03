import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, title: string) => {
  const data = {
    title,
    userId,
    completed: false,
  };

  return client.post<Todo>('/todos', data);
};
