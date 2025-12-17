/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import './TodoItem.scss';

type Props = {
  todo: Todo;
  loading: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, loading }) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      {/* This form is shown instead of the title and remove button
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value="Todo is being edited now"
              />
            </form>
            */}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loading,
        })}
      >
        <div
          className="modal-background
                    has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
