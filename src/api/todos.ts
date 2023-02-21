import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, newTodo: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, newTodo);
};

// export const updateTodo = (userId: number, data: any) => {
//   return client.patch<Todo>(`/todos?userId=${userId}`, data);
// };

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
