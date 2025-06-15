import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const BASE_URL = 'https://mate.academy/students-api';
export const USER_ID = 3059;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
