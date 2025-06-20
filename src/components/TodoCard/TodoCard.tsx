/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = { todo: Todo; deleteTodo: (todoId: number) => void };

export const TodoCard: React.FC<Props> = ({ todo, deleteTodo }) => {
  const { id, title, completed, loading } = todo;

  const handleDelete = () => {
    deleteTodo(id);
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
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
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
