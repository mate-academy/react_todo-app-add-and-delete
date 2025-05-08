import React, { useCallback } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoIds: number[]) => void;
  isLoading: boolean;
  loadingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  isLoading,
  loadingIds,
}) => {
  const { id, title, completed } = todo;

  const isItemLoading = isLoading || loadingIds.includes(id);

  const handleDelete = useCallback(() => {
    handleDeleteTodo([id]);
  }, [id, handleDeleteTodo]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', 'item-enter-done', { completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isItemLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
