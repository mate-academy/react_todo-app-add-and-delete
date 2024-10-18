import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1583;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getActiveTodos = () => {
  return getTodos().then(todos => todos.filter(todo => !todo.completed));
};

export const getCompletedTodos = () => {
  return getTodos().then(todos => todos.filter(todo => todo.completed));
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};
