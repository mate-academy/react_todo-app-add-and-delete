import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
// userId = 11822
export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodos = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const updateTodo = ({
  id, title, userId, completed,
}: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    id, title, userId, completed,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
// Add more methods here
