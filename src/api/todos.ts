import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 89;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: Partial<Todo>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodo = (changedTodo: Partial<Todo>) => {
  return client.patch<Partial<Todo>>(`/todos/${changedTodo.id}`, changedTodo);
};

// Add more methods here
// https://mate.academy/students-api/todos?userId=89
