import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const USER_ID = 11513;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (todoTitle: string) => {
  return client.post<Todo>('/todos', {
    title: todoTitle,
    userId: USER_ID,
    completed: false,
  });
};

export const updateTodo = ({
  id, title, userId, completed,
}: Todo): Promise<Todo> => {
  return client.patch(`/todos/${id}`, {
    title,
    userId,
    completed,
  });
};
