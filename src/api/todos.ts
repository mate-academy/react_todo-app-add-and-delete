import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2361;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = todoId => {
  return client.delete<Todo[]>(`/todos/${todoId}`);
};

export const postTodo = (data: Todo) => {
  return client.post<Todo[]>(`/todos`, data);
};

export const patchTodo = (todoId, data) => {
  return client.patch<Todo[]>(`/todos/${todoId}`, data);
};

export const clearTodos = async () => {
  const todos = await getTodos();

  await Promise.all(todos.map(todo => client.delete(`/todos/${todo.id}`)));
};
