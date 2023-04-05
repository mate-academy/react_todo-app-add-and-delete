import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deletedId: number,
  todoDelete: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletedId,
  todoDelete,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>
      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => todoDelete(id)}
      >
        ×
      </button>
      <div
        className={classNames(
          'modal overlay',
          { 'is-active': deletedId === id || id === 0 },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
