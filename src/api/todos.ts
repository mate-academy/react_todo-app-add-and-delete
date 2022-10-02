import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// eslint-disable-next-line @typescript-eslint/naming-convention
type createTypeTodo = Omit<Todo, 'id' >;

export const createTodo
  = async ({ userId, title, completed }: createTypeTodo) => {
    return client.post<Todo>('/todos', { userId, title, completed });
  };

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
