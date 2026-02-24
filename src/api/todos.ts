import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

// Registered User ID
export const USER_ID = 4012;

/**
 * Fetches the user's todos from the API
 */
export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods

/**
 * Creates a new todo on the API
 */
export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

/**
 * Deletes a todo from the API by its id
 */
export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
