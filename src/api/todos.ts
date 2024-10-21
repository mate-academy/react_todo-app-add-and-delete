import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1617;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (newTitle: string) => {
  const newTodo: Omit<Todo, 'id'> = {
    userId: USER_ID,
    title: newTitle,
    completed: false,
  };

  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
