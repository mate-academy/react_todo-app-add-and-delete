import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  processedTodos: number[],
  onDelete: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  processedTodos,
  onDelete,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': id === 0 || processedTodos.includes(id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
