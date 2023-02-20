import { Todo, TodoToPost } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodos = (newTodo:TodoToPost) => {
  return client.post<Todo>('/todos', newTodo);
};

// Add more methods here
