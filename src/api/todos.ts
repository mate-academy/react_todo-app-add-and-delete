import { Todo, TodoWithoutId } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 276;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (todoData: TodoWithoutId) => {
  return client.post<TodoWithoutId>(`/todos`, todoData);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
