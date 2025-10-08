import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3540;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const postTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, todo: Todo) => {
  return client.patch(`/todos/${id}`, todo);
};
