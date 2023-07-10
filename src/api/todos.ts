import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (body: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', body);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, status:boolean) => {
  return client.patch(`/todos/${todoId}`, { completed: status });
};
