import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 867;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const uploadTodo = ({ completed, title, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { completed, title, userId });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
