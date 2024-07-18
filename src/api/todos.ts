import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 962;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, todo: Todo) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};
