import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo;
};

export const TempTodoItem: React.FC<Props> = ({ tempTodo }) => {
  return (
    <li
      data-cy="Todo"
      className={classNames('todo')}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={tempTodo.completed}
        />
      </label>
      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {tempTodo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className="modal overlay is-active"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
