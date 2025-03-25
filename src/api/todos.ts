import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2487;

// Get all Todos
export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add a New Todo
export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

// Delete a Particular Toto
export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Update a particular Totd

// Add more methods here
