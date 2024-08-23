// api/todos.ts
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 959;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);
