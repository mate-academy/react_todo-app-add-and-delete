import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../utils/preferences';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}

export function addTodo(title: string) {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
}
