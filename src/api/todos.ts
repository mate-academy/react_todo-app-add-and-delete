import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  const newTodo = client.post<Todo[]>('/todos', data);

  return newTodo;
};

export const toggleStatus = (id: number, data: {}) => {
  const newTodo = client.patch<Todo[]>(`/todos/${id}`, data);

  return newTodo;
};

export const removeTodo = (id: number) => {
  const deleteTodo = client.delete(`/todos/${id}`);

  return deleteTodo;
};
