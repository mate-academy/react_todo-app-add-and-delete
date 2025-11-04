import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3637;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const postTodos = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { ...newTodo, userId: USER_ID });
};

export const patchTodo = (todoId: number, updatedData: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedData);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
