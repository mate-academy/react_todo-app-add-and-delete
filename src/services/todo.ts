import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export function createTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { title, completed, userId });
}

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}
