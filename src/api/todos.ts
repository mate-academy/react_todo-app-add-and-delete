import { RequestTodo } from '../types/RequestTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, data: RequestTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
