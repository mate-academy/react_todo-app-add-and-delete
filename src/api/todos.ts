import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// eslint-disable-next-line
export const addTodo = (newTodo: any) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (delatedTodoId: number) => {
  return client.delete(`/todos/${delatedTodoId}`);
};
// eslint-disable-next-line
export const changeTodo = (todoId: number, todoChanges: any) => {
  return client.patch<Todo>(`/todos/${todoId}`, todoChanges);
};
