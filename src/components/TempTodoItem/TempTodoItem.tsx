import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  tempTodo: Todo | null;
};

export const TempTodoItem: React.FC<Props> = ({ tempTodo }) => {
  if (!tempTodo) {
    return null;
  }

  const { title, completed } = tempTodo;

  return (
    <div
      key={tempTodo.id}
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
