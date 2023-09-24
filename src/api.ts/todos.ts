import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function deleteTodos(userId: number) {
  return client.delete(`/todos/${userId}`);
}

export function addTodos({ title, completed, userId }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { title, completed, userId });
}
