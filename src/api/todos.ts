import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2230;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const updateTodo = (
  id: number,
  updatedData: Partial<Todo>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, updatedData);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const postTodo = (newTodo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const clearCompletedTodos = (todos: Todo[]) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

  return Promise.all(deletePromises);
};
