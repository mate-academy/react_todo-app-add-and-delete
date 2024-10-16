import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../utils/UserId';

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> =>
  client.post<Todo>('/todos', todo);

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);
