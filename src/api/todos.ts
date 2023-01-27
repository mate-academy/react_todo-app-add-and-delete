import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (fieldsToCreate: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', fieldsToCreate);
};

// export const deleteTodo = (todoId: number) => {
//   return client.delete(`/todos/${todoId}`);
// };

// export const createTodo = (
//   userId?: number,
//   query?: string,
// ) => {
//   return client.post<Todo[]>(`/todos?userId=${userId}`, {
//     title: query,
//     completed: false,
//     userId,
//   });
// };
