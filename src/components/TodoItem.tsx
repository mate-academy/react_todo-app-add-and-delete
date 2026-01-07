/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, completed: boolean) => void;
  isLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  onStatusChange = () => {},
  isLoading = false,
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
  >
    <label
      className="todo__status-label"
      onClick={() => onStatusChange(todo.id, todo.completed)}
    >
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
      />
    </label>

    {/* If todo is being edited - show this form instead of title + remove button */}
    {/*
    <form>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={todo.title}
      />
    </form>
    */}

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => onDelete(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal', 'overlay', {
        'is-active': isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
