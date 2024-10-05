import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 545;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, {
    userId,
    title,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// export const deleteTodos = (todoIds: number[]) => {

//   return client.delete(`/todos/${todoId}`);
// };
