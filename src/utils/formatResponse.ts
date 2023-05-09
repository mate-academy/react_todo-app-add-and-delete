/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';

export const formatTodo = ({
  id, userId, title, completed,
}: any): Todo => {
  return {
    id, userId, title, completed,
  };
};

export const formatTodos = (todos: any[]) => {
  return todos.map(todo => formatTodo(todo));
};
