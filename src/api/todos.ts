import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3923;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}

export function createTodo(title: string) {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
}

export function updateTodo({ id, ...todoDate }: Todo) {
  return client.patch<Todo>(`/todos/${id}`, todoDate);
}
