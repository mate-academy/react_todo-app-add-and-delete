import React, { FC } from 'react';
import classNames from 'classnames';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType;
  removeTodo: (id: number) => void;
};

export const Todo:FC<Props> = ({ todo, removeTodo }) => {
  const {
    id,
    completed,
    title,
  } = todo;

  const handleRemove = () => {
    removeTodo(id);
  };

  return (
    <li className={classNames('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleRemove}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
