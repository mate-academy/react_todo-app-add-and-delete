import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const USER_ID = 4090;

type TodoData = Omit<Todo, 'id'>;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: TodoData) => {
  return client.post<Todo>('/todos', todo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
