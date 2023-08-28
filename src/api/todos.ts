import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}/?userId=${userId}`);
};

export const addTodo = (userId: number, data: Todo | null) => {
  return client.post<Todo[]>(`/todos/?userId=${userId}`, data);
};
