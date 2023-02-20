import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export function addTodos(userId: number, todo: Todo) {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
}

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};
