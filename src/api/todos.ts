import { TodoData } from '../types/TodoData';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoData[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = (newTodo: TodoData, userId: number) => {
  return client.post<TodoData[]>(`/todos?userId=${userId}`, newTodo);
};

export const deleteTodo = (todoId: number, userId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};
