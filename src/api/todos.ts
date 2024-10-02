import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1380;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}

export function createTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos/', {
    title,
    completed,
    userId,
  });
}

export function updateTodo(id: number, todoData: Partial<Todo>) {
  return client.patch<Todo>(`/todos/${id}`, todoData);
}
