import { client } from '../utils/fetchClient';

import { Todo } from '../types/Todo';

export const getTodos = (userId: number) => {
  const todos = client.get<Todo[]>(`/todos?userId=${userId}`);

  return todos || [];
};

export const addTodo = async (todo: Omit<Todo, 'id'>) => {
  const newTodo = client.post<Todo>('/todos', todo);

  return newTodo;
};

export const removeTodo = (todoId: number) => (
  client.delete(`/todos/${todoId}`)
);
