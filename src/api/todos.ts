import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (USER_ID: number) => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoItems = (
  {
    id,
    title,
    userId,
    completed,
  }: Todo,
) => {
  return client.patch<Todo>(`/todos/${id}`, { title, userId, completed });
};
