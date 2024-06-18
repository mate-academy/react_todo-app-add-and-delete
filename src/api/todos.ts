import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 606;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: Todo) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const delTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
