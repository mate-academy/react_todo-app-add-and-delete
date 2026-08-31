// eslint-disable-next-line import/extensions
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4439;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (id: number, completed: boolean, title?: string) => {
  return client.patch<Todo>(`/todos/${id}`, {
    completed,
    ...(title !== undefined && { title }),
  });
};
