import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3216;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function addTodos({ title, userId, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { title, userId, completed });
}

export function deleteTodos(id: number) {
  return client.delete(`/todos/${id}`);
}
