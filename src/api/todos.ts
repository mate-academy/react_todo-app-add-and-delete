import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 211;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = (addingTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, addingTodo);
};

export const deleteTodo = (deletingTodoId: number) => {
  return client.delete(`/todos/${deletingTodoId}`);
};
