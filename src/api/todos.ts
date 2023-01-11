/* eslint-disable consistent-return */
/* eslint-disable no-useless-return */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: any) => {
  if (userId) {
    return client.post<Todo>('/todos', todo);
  }

  return;
};

export const deleteTodo = (todoId: any) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
