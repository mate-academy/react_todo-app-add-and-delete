import { Todo } from '../types/Todo';
import { SendTodo } from '../types/SendTodo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => client.get<Todo[]>(`/todos?userId=${userId}`);

export const createTodo = (
  userId: number,
  data: SendTodo,
) => client.post<Todo>(`/todos?userId=${userId}`, data);

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);
