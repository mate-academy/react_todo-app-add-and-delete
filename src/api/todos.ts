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
  const post = await client.post('/todos', { title, userId, completed });

  return post;
};

export const deleteTodo = async (
  idTodo: number,
) => {
  const remove = await client.delete(`/todos/${idTodo}`);

  return remove;
};
