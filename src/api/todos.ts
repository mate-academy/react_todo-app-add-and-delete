/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const getTodos = () => {
  return client.get<Todo[]>('/todos?userId=10222');
};

export const postTodo = (data: any) => {
  return client.post('/todos?userId=10222', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
