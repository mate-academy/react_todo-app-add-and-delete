import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3722;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title }: { title: string }) => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({
  id,
  completed,
}: Pick<Todo, 'id' | 'completed'>) => {
  return client.patch<Todo>(`/todos/${id}`, {
    completed,
  });
};
