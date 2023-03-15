import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  deleteTodo: (id:number) => void;
};

export const TodoInfo: React.FC<Props> = ({ todo, isLoading, deleteTodo }) => {
  const { title, completed, id } = todo;
  const [isEditing] = useState(false);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      {isEditing
        ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        ) : (
          <>
            <span className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': isLoading },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
