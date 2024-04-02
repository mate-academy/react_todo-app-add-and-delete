import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 407;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function postTodo(todo: Todo) {
  return client.post<Todo>('/todos', todo);
}

export function deleteTodoById(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

// Add more methods here
