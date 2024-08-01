/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  isLoadingId?: number | null;
  setIsLoadingId: (id: number | null) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  isLoadingId,
  setIsLoadingId,
}) => {
  const handleDelete = (id: number) => {
    deleteTodo(id);
    setIsLoadingId(id);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', 'item-enter-done', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoadingId === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
