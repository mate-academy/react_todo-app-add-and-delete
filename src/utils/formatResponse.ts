/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';
import { TodoResponse } from '../types/TodoResponse';

export const formatTodo = (data: TodoResponse): Todo => {
  const { id, title, completed } = data;

  return {
    id, title, completed,
  };
};

export const formatTodos = (todos: TodoResponse[]): Todo[] => {
  return todos.map(todo => formatTodo(todo));
};
