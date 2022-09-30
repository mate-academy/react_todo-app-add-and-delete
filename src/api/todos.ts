import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, title: string) => {
  const newTodo = {
    userId,
    title,
    completed: true,
  };

  return client.post<Todo>('/todos', newTodo);
};
