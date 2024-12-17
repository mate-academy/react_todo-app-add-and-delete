import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1912;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const createTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
}

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

