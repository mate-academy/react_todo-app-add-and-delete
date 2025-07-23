import { Todo, TodoCreate } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3264;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = (newTodo: TodoCreate) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
