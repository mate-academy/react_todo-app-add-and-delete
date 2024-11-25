import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1879;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const editTodos = (data: { title: string; todoId: number }) => {
  return client.patch<Todo>(`/todos/${data.todoId}`, data);
};

export const deleteTodos = (id: number) => {
  return client.delete<Todo>(`/todos/${id}`);
};
