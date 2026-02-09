import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3964;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

type NewTodoData = {
  title: string;
  userId: number;
  completed: boolean;
};

export const addTodo = (data: NewTodoData) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
