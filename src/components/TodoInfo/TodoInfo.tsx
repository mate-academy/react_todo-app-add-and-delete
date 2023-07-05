import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo?: (todoId: number) => void;
  loadingTodoId?: number | null;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDeleteTodo = () => {},
  loadingTodoId = null,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { id, title, completed } = todo;

  useEffect(() => {
    if (loadingTodoId === id) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingTodoId]);

  const handleDeleteTodo = () => {
    onDeleteTodo(id);
  };

  return (
    <div
      className={classNames('todo', {
        completed: completed === true,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteTodo}
        disabled={isLoading}
      >
        ×
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
