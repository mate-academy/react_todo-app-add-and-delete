import React from 'react';
import classNames from 'classnames';
import { Todo as TodoType } from '../../types/Todo';

type Props = {
  todoItem: TodoType
};

export const Todo: React.FC<Props> = ({ todoItem }) => {
  const { completed, title } = todoItem;

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

      <button type="button" className="todo__remove">×</button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
