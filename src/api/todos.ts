import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (
  title: string,
  userId: number,
  completed: boolean,
) => {
  const newTodo = {
    title,
    userId,
    completed,
  };

  return client.post('/todos', newTodo);
};

export const updateTodo = (
  todoId: number,
  title: string | null,
  completed: boolean | null,
) => {
  if (title) {
    return client.patch(`/todos/${todoId}`, { title });
  }

  return client.patch(`/todos/${todoId}`, { completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
