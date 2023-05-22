import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
}

export const TempTodo: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;

  return (
    <section className="todoapp__main">
      <div
        className={classNames('todo',
          { completed })}
        key={id}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span className="todo__title">{title}</span>
        <button
          type="button"
          className="todo__remove"
        >
          ×
        </button>

        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
