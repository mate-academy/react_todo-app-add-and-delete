import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3969;

type NewTodo = Omit<Todo, 'id'>;

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: NewTodo): Promise<Todo> => {
  return client.post<Todo, NewTodo>('/todos', todo);
};

export const deleteTodo = (todoId: number): Promise<void> => {
  return client.delete(`/todos/${todoId}`);
};
