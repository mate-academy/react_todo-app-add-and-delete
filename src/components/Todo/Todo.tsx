import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo as TodoType } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';

type Props = {
  todoItem: TodoType
  setDeleteError: (errorState: boolean) => void;
  setError: (errorState: boolean) => void;
  handleErrorState:(
    secondFunction: (state: boolean) => void,
    state: boolean,
  ) => void;
  isClearAllCompleted: boolean;
};

export const Todo: React.FC<Props>
= ({
  todoItem,
  setDeleteError,
  setError,
  handleErrorState,
  isClearAllCompleted,
}) => {
  const { completed, title, id } = todoItem;

  const [isLoading, setLoading] = useState(false);

  const handleDeleteTodos = (todoId: typeof id) => {
    setLoading(true);

    deleteTodos(todoId)
      .then(() => setLoading(false))
      .catch(() => {
        handleErrorState(setError, true);
        handleErrorState(setDeleteError, true);
      })
      .finally(() => setLoading(false));
  };

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

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodos(id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal',
        'overlay',
        { 'is-active': isLoading || (completed && isClearAllCompleted) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
