import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4236;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const createTodo = ({
  title,
  userId,
  completed,
}: {
  title: string;
  userId: number;
  completed: boolean;
}) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
