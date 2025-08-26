import { Todo } from '../types/Todo';
import { TodoData } from '../types/TodoData';
import { client } from '../utils/fetchClient';

export const USER_ID = 3380;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<TodoData>(`/todos`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
