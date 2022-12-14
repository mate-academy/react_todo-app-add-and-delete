import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const getActiveTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}&completed=false`);
};

export const getCompletedTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}&completed=true`);
};

export const addTodo = (dataInfo: any) => {
  return client.post<Todo[]>('/todos/', dataInfo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
