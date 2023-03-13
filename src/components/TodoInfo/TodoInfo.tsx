import React, { useState } from 'react';
import classNames from 'classnames';
import { TodoType } from '../../types/TodoType';

type Props = {
  todo: TodoType;
  isRemoveAll: boolean;
  onDelete: (todoId: number) => void;
};

export const TodoInfo: React.FC<Props> = ({ todo, onDelete, isRemoveAll }) => {
  const {
    title,
    completed,
    id,
  } = todo;
  const [isEditing, setEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleClick = () => {
    onDelete(id);
    setLoading(true);
  };

  const handleDblClick = () => {
    setEdit(true);
  };

  return (
    <>
      {isEditing ? (
        <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
            />
          </form>
          <div
            className="modal overlay"
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ) : (
        <div
          className={classNames(
            'todo',
            { completed },
          )}
          onDoubleClick={handleDblClick}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              defaultChecked={completed}
            />
          </label>
          <span className="todo__title">{title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleClick}
          >
            ×
          </button>
          <div
            className={classNames(
              'modal',
              'overlay',
              { 'is-active': isLoading || (isRemoveAll && completed) },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
