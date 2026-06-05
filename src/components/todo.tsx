/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import { Todo } from '../types/Todo';
import clsx from 'clsx';

interface Props {
  todo: Todo;
  deleteTodo: (target: number) => void;
  targetId: number[];
  setCompleted: (todo: Todo) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  targetId,
  setCompleted,
}) => {
  return (
    <div data-cy="Todo" className={clsx('todo', todo.completed && 'completed')}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => setCompleted(todo)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={clsx(
          'modal',
          'overlay',
          targetId.includes(todo.id) && 'is-active',
        )}
      >
        <div id="plug" className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
