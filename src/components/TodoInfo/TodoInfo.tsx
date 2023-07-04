import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  loadingTodosIds: number[];
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  loadingTodosIds,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loadingTodosIds.includes(todo.id)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingTodosIds]);

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed === true,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDeleteTodo(todo.id)}
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
