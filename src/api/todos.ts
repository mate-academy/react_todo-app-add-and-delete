import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3124;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodo = (title: string): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    title: title.trim(),
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number): Promise<void> => {
  return client.delete(`/todos/${todoId}`);
};
