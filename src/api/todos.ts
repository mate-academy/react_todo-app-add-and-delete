import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function createTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
  return client.post('/todos', { title, completed, userId });
}

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}
