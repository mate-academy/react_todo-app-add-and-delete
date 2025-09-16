import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3485;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = (data: Todo) => {
  return client.post<Todo>('/todos', data);
};

export const changeTodo = (data: Todo) => {
  return client.patch<Todo>(`/todos/${data.id}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
