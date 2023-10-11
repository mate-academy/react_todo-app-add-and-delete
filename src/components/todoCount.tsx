import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
}

export const TodoCount: React.FC<Props> = ({ todos }) => {
  const todosLeftCount = todos.filter((todo) => !todo.completed).length;

  return (
    <span className="todo-count">
      {todosLeftCount}
      {' '}
      {todosLeftCount === 1 ? 'item' : 'items'}
      {' '}
      left
    </span>
  );
};
