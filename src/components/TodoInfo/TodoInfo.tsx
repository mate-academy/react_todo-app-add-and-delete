import cn from 'classnames';
import React, { useState } from 'react';
import { deleteTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  showError: (message: Errors) => void
  getTodosFromServer: () => void
  isClearCompleted: boolean
}

export const TodoInfo:React.FC<Props> = React.memo(
  ({
    todo,
    showError,
    getTodosFromServer,
    isClearCompleted,
  }) => {
    const {
      title,
      completed,
      id,
    } = todo;

    const [isModalActive, setIsModalActive] = useState(false);
    const handleDeleteButtonClick = async () => {
      setIsModalActive(true);
      try {
        await deleteTodo(id);
      } catch {
        showError(Errors.DELETE);
      }

      await getTodosFromServer();

      setIsModalActive(false);
    };

    const isLoading = isClearCompleted && completed;

    return (
      <div
        className={cn('todo', {
          completed,
        })}
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
          onClick={handleDeleteButtonClick}
        >
          ×
        </button>

        <div className={cn('modal overlay', {
          'is-active': isModalActive || isLoading,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
