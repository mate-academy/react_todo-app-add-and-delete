import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 882;

const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

const deleteTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};

const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

export const todoService = {
  getTodos,
  deleteTodo,
  addTodo,
};
