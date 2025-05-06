import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2714;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function createTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
  return client.post<Todo>(`/todos`, { title, completed, userId });
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function updateTodo({ id, title, completed, userId }: Todo) {
  return client.patch<Todo>(`/todos/${id}`, { title, completed, userId });
}
