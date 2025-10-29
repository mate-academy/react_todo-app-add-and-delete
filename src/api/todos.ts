import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3646;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  const trimmedTitle = title.trim();

  return client.post<Todo>('/todos', {
    title: trimmedTitle,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
