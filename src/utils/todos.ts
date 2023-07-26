import { Todo } from '../types/Todo';
import { client } from './fetchClient';
import { USER_ID } from './user';

export function getTodos() {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
}

export function addTodo(title: string, completed: boolean) {
  return client.post<Todo>('/todos', { userId: USER_ID, title, completed });
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}
