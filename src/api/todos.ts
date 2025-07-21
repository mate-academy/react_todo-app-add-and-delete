import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3219;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function addTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>(`/todos/`, { userId, title, completed });
}

export function updateCompleted(todoId: number, completed: boolean) {
  return client.patch<Todo>(`/todos/${todoId}`, { completed });
}

export function deleteTodo(todoId: number) {
  return client.delete<Todo>(`/todos/${todoId}`);
}
