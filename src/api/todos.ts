import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';

export const USER_ID = 1484;

export function getTodos(USER_ID: number): Promise<Todo[]> {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`)
}

export function createTodos(todo: Omit<Todo, 'id'>): Promise<Todo> {
  return client.post<Todo>(`/todos`, todo);
}

export function updateTodo(todo: Todo): Promise<Todo> {
  return client.patch<Todo>(`/todos/${todo.id}`, todo)
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`)
}
