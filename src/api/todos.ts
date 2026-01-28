import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3884;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodo = (todoId: number, changedValue: Partial<Todo>) => {
  const data = { ...changedValue };

  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const createTodo = (title: string) => {
  const data = {
    title,
    userId: USER_ID,
    completed: false,
  };

  return client.post<Todo>(`/todos?userId=${USER_ID}`, data);
};
