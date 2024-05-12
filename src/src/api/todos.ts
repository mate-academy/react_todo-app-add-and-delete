import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ title, userId, completed }: Todo) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodo = (userId: number) => {
  return client.delete<number>(`/todos/${userId}`);
};
