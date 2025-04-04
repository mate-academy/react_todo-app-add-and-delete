import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onToggle: (id: number) => void;
}

export const TodoStatus: React.FC<Props> = ({ todo, onToggle }) => (
  <label
    id={`todo-label-${todo.id}`}
    className="todo__status-label"
    htmlFor={`todo-status-${todo.id}`}
  >
    <input
      id={`todo-status-${todo.id}`}
      aria-labelledby={`todo-label-${todo.id}`}
      data-cy="TodoStatus"
      type="checkbox"
      className="todo__status"
      checked={todo.completed}
      onChange={() => onToggle(todo.id)}
    />
  </label>
);
