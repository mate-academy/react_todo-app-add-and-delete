import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3627;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (todo: Todo) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};
// Add more methods here
