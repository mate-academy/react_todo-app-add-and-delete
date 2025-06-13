import { Todo } from '../types/todo/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3054;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (body: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', body);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
