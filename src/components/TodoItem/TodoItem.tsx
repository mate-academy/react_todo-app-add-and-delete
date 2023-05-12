/* eslint-disable no-console */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo?: (id: number) => void;
  isProcessingId?: number[];
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo, removeTodo, isProcessingId = [0],
}) => {
  const { title, completed, id } = todo;

  const handleRemove = () => {
    if (removeTodo) {
      removeTodo(id);
    }
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleRemove}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        { 'is-active': isProcessingId.includes(id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
