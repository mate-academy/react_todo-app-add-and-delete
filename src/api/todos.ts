import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 310;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function createTodo(data: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', data);
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}
