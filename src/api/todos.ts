import { Todo, TodoData } from '../types';
import { client } from '../utils/fetchClient';

export const USER_ID = 10348;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: TodoData) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
