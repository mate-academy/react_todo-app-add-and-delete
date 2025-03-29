import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1767;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post(`/todos`, { ...todo, userId: USER_ID });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodoStatus = (todoId: number, status: boolean) => {
  return client.patch(`/todos/${todoId}`, { completed: status });
};
// Add more methods here
