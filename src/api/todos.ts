import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4063;

export const getTodos = async () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = async (
  todoId: Todo['id'],
  data: Partial<Omit<Todo, 'id'>>,
) => {
  return client.patch(`/todos/${todoId}`, data);
};

export const deleteTodo = async (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};
