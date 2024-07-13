import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

export type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  loading: boolean;
  deleting: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  loading,
  deleting,
}) => {
  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        {loading && todo.id === 0 ? (
          <div className="loader is-active" data-cy="TodoLoader"></div>
        ) : (
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        )}
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
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
        className={classNames('modal overlay', {
          'is-active': deleting === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
