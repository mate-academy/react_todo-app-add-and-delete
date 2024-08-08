import { Todo } from '../types/todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1128;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodo = (todo: Todo, todoId: number) => {
  return client.patch(`/todos/${todoId}`, todo);
};
