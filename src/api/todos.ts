import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = async (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const patchTodos = (userId: number, data: Todo[]) => {
  return client.patch<Todo[]>(`/todos/${userId}`, data);
};

export const postTodos = (data: Todo) => {
  return client.post<Todo[]>('/todos', data);
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};
