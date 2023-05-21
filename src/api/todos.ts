import { Todo, TodoData } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (newTodo: TodoData) => {
  return client.post<Todo>('/todos/', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updatingTodo = (todoId: number, data: Partial<TodoData>) => {
  return client.patch<Todo>(`todos/${todoId}`, data);
};
