import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2973;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: NewTodo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

// Add more methods here
