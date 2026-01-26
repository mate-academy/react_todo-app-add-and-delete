/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  deletingTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed, id },
  handleDeleteTodo,
  deletingTodoId,
}) => {
  return (
    <>
      {/* This is a completed todo */}
      <div
        data-cy="Todo"
        className={cn('todo', { completed: completed === true })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status loader"
            checked={completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title ">
          {/* Completed Todo */}
          {title}
        </span>
        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(id)}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being deleted or updated */}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': id === 0 || id === deletingTodoId,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
