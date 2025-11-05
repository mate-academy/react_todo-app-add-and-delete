import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3635;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, newTodo);
};

export const deleteTodo = (todoIdToDelete: Todo['id']) => {
  return client.delete(`/todos/${todoIdToDelete}`);
};

// Add more methods here
// https://mate.academy/students-api/todos?userId=3635
