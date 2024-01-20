import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export function getTodos(userId: string) {
  return client.get<Todo[]>(userId);
}

export function deleteTodos(todoId: string) {
  return client.delete(todoId);
}

export function createTodos({ title, userId, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { title, userId, completed });
}
