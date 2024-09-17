import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1245;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (TODO_ID: number) => {
  return client.delete(`/todos/${TODO_ID}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};
