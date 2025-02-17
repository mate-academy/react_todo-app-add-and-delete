import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 332;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// export const editTodos = ({ id, userId, title, completed }: Todo) => {
//   return client.patch<Todo>(`/todos/${id}?userId=${USER_ID}`, {
//     id,
//     userId,
//     title,
//     completed,
//   });
// };
