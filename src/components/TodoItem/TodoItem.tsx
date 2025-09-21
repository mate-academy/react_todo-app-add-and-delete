import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React from 'react';

type Props = {
  todo: Todo;
  onDelete?: (id: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete }) => {
  const isCompleted = todo.completed;
  const [pendingDeletion, setPendingDeletion] = React.useState(false);

  const handleDelete = async (id: number) => {
    if (!onDelete) {
      return;
    }

    setPendingDeletion(true);
    try {
      await onDelete(id);
    } catch {
      setPendingDeletion(false);
    }
  };

  const showLoader = (todo.isTemp === true && todo.id === 0) || pendingDeletion;

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: isCompleted })}
      >
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': showLoader })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>

        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label" htmlFor={String(todo.id)}>
          <input
            id={todo.id.toString()}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={isCompleted}
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      </div>
    </>
  );
};
