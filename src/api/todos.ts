import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4099;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (newTodo: NewTodo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (idTodo: number) => {
  return client.delete(`/todos/${idTodo}`);
};
// Add more methods here
