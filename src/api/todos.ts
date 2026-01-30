import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3884;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const edit = (todoId: number, changedValue: Partial<Todo>) => {
  const data = { ...changedValue };

  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const createTodo = (data: Partial<Todo>) => {
  return client.post<Todo>('/todos', data);
};
