import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export function deleteUserTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function createTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { title, completed, userId });
}

export function updateTodo(
  {
    id,
    title,
    completed,
    userId,
  }: Todo,
) {
  return client.patch<Todo>(`/todos/${id}`, { title, completed, userId });
}
