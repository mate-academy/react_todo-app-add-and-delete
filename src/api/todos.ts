import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (title: string, userId: number, completed: boolean) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
