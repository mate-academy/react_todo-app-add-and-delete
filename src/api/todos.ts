import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3108;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function createTodo(todo: Todo) {
  return client.post<Todo>('/todos', todo);
}

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}
