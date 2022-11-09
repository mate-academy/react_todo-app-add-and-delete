import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteButton?: (todoId: number) => void;
  isAdding?: boolean;
  isDeleting?: boolean;
  key?: number;
  isActive?: boolean;
};

export const TodoInfo: React.FC<Props>
= React.memo(({
  todo, handleDeleteButton, isAdding,
  isActive,
}) => {
  const {
    title,
    completed,
  } = todo;

  const [todoDone, setTodoDone] = useState(completed);

  const handleStatus = () => {
    setTodoDone(!todoDone);
  };

  const handleDeleteOnClick = () => {
    if (handleDeleteButton) {
      handleDeleteButton(todo.id);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todoDone === true })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={handleStatus}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDeleteOnClick}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', {
            'is-active': isAdding || isActive,
          })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
