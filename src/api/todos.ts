import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3341;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// my methods
export const addTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// export const updateTodo = (todoId: number, data: Partial<Todo>) => {
//   return client.patch<Todo>(`/todos/${todoId}`, data);
// };
