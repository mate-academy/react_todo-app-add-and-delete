import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id:number) => void;
  updatingId: number[];
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  updatingId,
}) => {
  const { id, title, completed } = todo;

  return (
    <>
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
          onClick={() => removeTodo(id)}
        >
          ×
        </button>

        <div className={classNames(
          'modal',
          'overlay',
          { 'is-active': updatingId.includes(id) },
        )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
