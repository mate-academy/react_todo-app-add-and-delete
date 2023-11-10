import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  selectedTodoId?: number;
  handleChangeComplete?: (todo: Todo) => void;
  handleDelete?: (id: number) => void;
  isDisableInput?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedTodoId,
  isDisableInput = false,
  handleChangeComplete = () => {},
  handleDelete = () => {},
}) => {
  const {
    id,
    completed,
    title,
  } = todo;
  const isActive = isDisableInput || id === selectedTodoId;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleChangeComplete(todo)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
