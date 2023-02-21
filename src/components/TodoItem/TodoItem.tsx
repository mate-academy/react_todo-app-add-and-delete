import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: () => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
}) => {
  return (
    <div
      className={
        classNames(
          'todo',
          {
            completed: todo.completed,
          },
        )
      }
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={onDelete}
      >
        ×
      </button>

      {todo.id === 0 && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
