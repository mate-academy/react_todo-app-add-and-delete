import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4493;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function createTodo(title: string) {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
}

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}
