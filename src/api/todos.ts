import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 10299;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Todo) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${USER_ID}`);
};
