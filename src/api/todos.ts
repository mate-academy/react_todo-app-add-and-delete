import { TodoItem } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4222;

export const getTodos = () => {
  return client.get<TodoItem[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = (todo: Omit<TodoItem, 'id'>) => {
  return client.post<TodoItem>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
