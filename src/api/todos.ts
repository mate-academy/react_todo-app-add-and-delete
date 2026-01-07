import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3821;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const updateTodo = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}?userId=${USER_ID}`, {
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
