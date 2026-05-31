import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = import.meta.env.VITE_USERID;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Todo): Promise<Todo> => {
  return client.post('/todos', newTodo);
};

export const updateTodo = (todoToUpdate: Todo): Promise<Todo> => {
  return client.patch(`/todos/${todoToUpdate.id}`, todoToUpdate);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
