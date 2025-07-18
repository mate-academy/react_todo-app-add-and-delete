import React from 'react';
import { Todo } from '../types/Todo';
import '../styles/index.scss';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  isBusy: boolean;
  globalLoading: boolean;
  onDelete: () => void;
  onToggle: () => void;
}

const TodoItem: React.FC<Props> = ({
  todo,
  isBusy,
  globalLoading,
  onDelete,
  onToggle,
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', {
      completed: todo.completed,
    })}
  >
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={onToggle}
        disabled={isBusy || globalLoading}
      />
    </label>
    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={onDelete}
      disabled={isBusy}
    >
      ×
    </button>
    <div
      className={classNames('modal', 'overlay', {
        'is-active': isBusy,
      })}
      data-cy="TodoLoader"
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);

export default React.memo(TodoItem);
