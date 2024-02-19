import { Todo } from '../Types/Todo';
import { client } from './fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (id: number) => {
  return client.delete<Todo>(`/todos/${id}`);
};
