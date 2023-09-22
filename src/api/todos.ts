import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

// export const patchTodo = ({
//   id,
//   userId,
//   completed,
//   title,
// }: Todo) => {
//   return client.patch<Todo>(`/todos/${id}`, { userId, completed, title });
// };

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
