import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 712;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodoToServer = ({
  title,
  userId = USER_ID,
  completed,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const deleteTodoFromServer = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};
