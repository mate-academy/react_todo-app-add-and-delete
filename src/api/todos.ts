import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 635;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const udateTodo = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo[]>(`/todos/${id}`, { title, userId, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};
