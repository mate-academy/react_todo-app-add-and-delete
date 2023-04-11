import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onDeleteTodo: (id: number) => void,
}

export const TodoItem: React.FC<Props> = (
  { todo, onDeleteTodo },
) => {
  const { title, completed, id } = todo;

  return (
    <div className={classNames(
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

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDeleteTodo(id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
