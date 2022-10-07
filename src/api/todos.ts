import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = async (
  title: string,
  userId: number,
  completed: boolean,
) => {
  return client.post('/todos', { title, userId, completed });
};

export const deleteTodo = async (
  idTodo: number,
) => {
  return client.delete(`/todos/${idTodo}`);
};
