import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// export const deleteTodos = (todoId: number) => {
//   return client.delete(`/todos/${todoId}`);
// };
export const deleteTodos = async (todoId: number) => {
  await client.delete(`/todos/${todoId}`);

  return todoId;
};

export const postTodos = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

// Add more methods here
