import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

// Dodaj nowe zadanie na serwerze
export const addTodo = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};

// Usuń zadanie o określonym ID z serwera
export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
