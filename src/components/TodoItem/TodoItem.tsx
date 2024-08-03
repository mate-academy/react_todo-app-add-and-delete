/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
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
  const [checked, setChecked] = useState(false);
  const [itemEnterDone, setItemEnterDone] = useState(false);

  const { title, completed, id } = todo;

  const handleDelete = (idTodo: number) => {
    deleteTodo(idTodo);
    setIsLoadingId(idTodo);
  };

  useEffect(() => {
    setChecked(completed);
    setItemEnterDone(true);
  }, [completed]);

  const handleOnChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setItemEnterDone(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: checked,
        'item-enter-done': itemEnterDone,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={checked}
          onChange={handleOnChecked}
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
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoadingId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
