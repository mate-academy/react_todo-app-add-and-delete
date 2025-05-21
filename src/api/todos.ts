import { Todo, TodoData } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2968;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: TodoData) => {
  return client.post<Todo>(`/todos`, todo);
};

export const removeTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
