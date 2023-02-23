import { SendTodo } from '../types/SendTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (
  userId: number,
  data: SendTodo,
) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (
  todoId: number,
) => {
  return client.delete(`/todos/${todoId}`);
};
// Add more methods here
