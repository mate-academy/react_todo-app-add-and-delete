import { Todo, TodoResponse } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2179;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const postTodo = (data: Partial<Todo>): Promise<TodoResponse> => {
  return client.post('/todos', data);
};

export const deleteTodo = (todoID: number | null) => {
  return client.delete(`/todos/${todoID}`);
};
