import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// export const deleteTodo = ({ id: number }) => {
//   return client.delete<number>(`/todos/${id}`);
// };

export function deletePost(postId: number) {
  return client.delete(`/todos/${postId}`);
}

export const createTodos = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

// Add more methods here
