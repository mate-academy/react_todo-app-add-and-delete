/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import React from 'react';

interface Props {
  todo: Todo;
  deleteTodo?: (todoId: number) => void;
  isLoading: boolean;
}
export const TodoItem: FC<Props> = ({
  todo,
  deleteTodo = () => {},
  isLoading,
}) => {
  const { id, completed, title } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
