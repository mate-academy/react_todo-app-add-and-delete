import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (userId: number, title: string) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const updateTodo = (
  todoId: number,
  property: Partial<Todo>,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, property);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
