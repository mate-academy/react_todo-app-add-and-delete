import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 347;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const setCompletedTodo = ({ id, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const postTodo = ({ userId, title, completed }: Partial<Todo>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};
