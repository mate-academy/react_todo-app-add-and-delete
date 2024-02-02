import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: {
  title: string; completed: boolean; userId: number
}): Promise<Todo> => {
  return client.post<Todo>('/todos', todo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const removeTodos = (todoIds: number[]) => {
  const deletePromise = todoIds.map(todoId => client.delete(`/todos/${todoId}`));

  return Promise.all(deletePromise);
};
// Add more methods here
