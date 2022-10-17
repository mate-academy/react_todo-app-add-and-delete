import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodos = (
  userId: number,
  title: string,
) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const removeTodos = (todoId: number):Promise<unknown> => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (
  todoId: number,
  data: Partial<Todo>,
): Promise<Todo> => client.patch(`/todos/${todoId}`, data);
