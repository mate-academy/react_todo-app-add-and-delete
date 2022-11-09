import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodosAPI = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const getCompletedTodosAPI = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}&completed=true`);
};

export const addTodoAPI = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodoAPI = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
