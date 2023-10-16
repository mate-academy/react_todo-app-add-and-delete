import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = (todoId: number, todosChanges: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, todosChanges);
};

export const deleteTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};
