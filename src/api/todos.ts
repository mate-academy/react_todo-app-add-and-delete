// src/api/todos.ts

import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 879; // Replace with your user ID

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};
