import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 634;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function createTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>(`/todos/`, { userId, title, completed });
}

export function deletePost(todo: Todo) {
  return client.delete(`/todos/${todo.id}`);
}
