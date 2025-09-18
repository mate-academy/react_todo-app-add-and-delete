import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3493;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function deleteTodos(postId: number) {
  return client.delete(`/todos/${postId}`);
}

export function addTodos({ title, userId, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { title, userId, completed });
}

export function updateTodos({ id, ...todotData }: Todo) {
  return client.patch<Todo>(`/todos/${id}`, todotData);
}

// Add more methods here
