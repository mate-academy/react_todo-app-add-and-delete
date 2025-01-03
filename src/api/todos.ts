import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2217;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title: title.trim(),
    userId: USER_ID,
    completed: false,
  });
};

export const updateTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, { data });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
