import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2392;

export function getTodos(userId: number) {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
}
export function createTodo({
  title,
  completed,
  userId = USER_ID,
}: Omit<Todo, 'id'>) {
  return client.post<Todo>(`/todos`, { title, completed, userId });
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}
