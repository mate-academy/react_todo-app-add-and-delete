import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type Data = {
  userId: number,
  title: string,
  completed: boolean,
};

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, data: Data) => {
  return client.post(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Todo) => {
  return client.patch(`/todos/${todoId}`, data);
};
