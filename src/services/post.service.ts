import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../api/todos';

export function getTodos() {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function addTodo(title: string) {
  return client.post('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
}
