import { Todo, TodoWithoutId } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 276;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (todoData: TodoWithoutId): Promise<Todo> => {
  return client.post<Todo>(`/todos`, todoData);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
