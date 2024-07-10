import { CreateTodoDTO, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 460;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: CreateTodoDTO): Promise<Todo> => {
  return client.post('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
