import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: any) => {
  const newTodo = client.post<Todo[]>('/todos', data);

  return newTodo;
};

export const markDone = (id: any, data: any) => {
  const newTodo = client.patch<Todo[]>(`/todos/${id}`, data);

  return newTodo;
};

export const removeTodo = (id: number) => {
  const deleteTodo = client.delete(`/todos/${id}`);

  return deleteTodo;
};
