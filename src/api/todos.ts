import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, {
  title,
  completed = false,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    title,
    completed,
    userId,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
