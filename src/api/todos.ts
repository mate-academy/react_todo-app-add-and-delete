import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1606;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> =>
  client.post<Todo>('/todos', todo);
export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);
