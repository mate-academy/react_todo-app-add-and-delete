import { Todo } from '../types/Todo';
import { TodoQueryToServ } from '../types/todoQueryToServ';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number | string) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodoToServer = (userId: number, data: TodoQueryToServ) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const removeTodo = (todoId: string) => {
  return client.delete(`/todos/${todoId}`);
};
