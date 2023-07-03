import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (todoId: number) => {
  return client.get<Todo[]>(`/todos?userId=${todoId}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
