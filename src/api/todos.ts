import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 504;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const createTodo = (data: Todo) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
