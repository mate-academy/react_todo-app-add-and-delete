import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 11219;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ title, completed, userId, id }: Todo) => {
  return client.post<Todo[]>(`/todos/${id}`, { title, completed, userId, id });
};
