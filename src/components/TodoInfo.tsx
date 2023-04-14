import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  onDelete: (id: number) => void,
  onToggle: (id: number) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo, isLoading, onDelete, onToggle,
}) => {
  const { title, completed } = todo;

  const handleOnToggleChange = () => {
    onToggle(todo.id);
  };

  const handleOnDeleteChange = () => {
    onDelete(todo.id);
  };

  return (
    <div className={
      classNames('todo', { completed })
    }
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handleOnToggleChange}
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleOnDeleteChange}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
