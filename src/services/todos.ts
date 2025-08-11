import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3301;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function createTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { userId, title, completed });
}
