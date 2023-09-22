import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (todoData: Todo) => {
  return client.post<Todo>('/todos', todoData);
};

export const updateTodo = (todoId: number, updatedFields: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedFields);
};
