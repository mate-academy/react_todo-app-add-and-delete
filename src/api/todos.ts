import { Todo, TodoServerData } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4476;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: TodoServerData) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
