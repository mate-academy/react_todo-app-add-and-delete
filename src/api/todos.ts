import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodos = (userId: number, data: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const deletTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodos = (
  id: number,
  data: Todo | Pick<Todo, 'completed'> | Pick<Todo, 'title'>,
) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
