import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, title: string) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number, property: Partial<Todo>,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, property);
};
