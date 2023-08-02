import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function removeTodo(todoId: number): Promise<void> {
  return client.delete(`/todos/${todoId}`);
}

export function createTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { title, userId, completed });
}
