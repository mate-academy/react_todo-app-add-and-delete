import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

type TodoData = Pick<Todo, 'title' | 'userId' | 'completed'>;

export const addTodo = async ({ title, userId, completed }: TodoData) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};
