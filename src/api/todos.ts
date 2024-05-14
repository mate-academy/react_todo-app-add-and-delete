import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 562;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (NewTodo: any) => {
  return client.post<Todo>('/todos', NewTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
