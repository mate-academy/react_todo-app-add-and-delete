import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const USER_ID = 7788;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
