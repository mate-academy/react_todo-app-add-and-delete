/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import * as f from '../api/todos';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoading: boolean;
  setErrorText: (text: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  setErrorText,
}) => {
  const { title, completed, id } = todo;
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleDelete = () => {
    setDeleteLoading(true);
    f.deleteTodo(id)
      .then(() => {
        setDeleteLoading(false);
        onDelete(id);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
        setDeleteLoading(false);
        setErrorText('Unable to delete a todo');
      });
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: !isLoading && completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-checkbox-${id}`}>
        <input
          id={`todo-checkbox-${id}`}
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

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || deleteLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
