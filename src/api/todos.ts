import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';
export const USER_ID = 3304;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, {
    userId,
    title,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ userId, title, completed, id }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    userId,
    title,
    completed,
    id,
  });
};
