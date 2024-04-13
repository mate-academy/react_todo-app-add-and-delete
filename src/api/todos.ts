import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 422;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, userId, title, completed }: Todo) => {
  return client.patch(`/todos/${id}`, { userId, title, completed });
};
