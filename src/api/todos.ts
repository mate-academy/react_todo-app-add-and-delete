import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3032;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (todo: Todo) => {
  return client.post<Todo>(`/todos`, todo);
};

export const updateTodo = (todoId: number, todoProp: Partial<Todo>) => {
  return client.patch(`/todos/${todoId}`, todoProp);
};

export const updateTodos = (todoProp: Partial<Todo>) => {
  return client.patch(`/todos?userId=${USER_ID}`, todoProp);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
