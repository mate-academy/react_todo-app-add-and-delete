import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => void;
  idUpdating: number[];
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  idUpdating,
}) => {
  const { id, title, completed } = todo;

  return (
    <li
      className={classNames('todo', { completed })}
    >
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
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal', 'overlay',
        { 'is-active': idUpdating.includes(id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
