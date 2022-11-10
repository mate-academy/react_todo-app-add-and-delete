import React from 'react';

import classNames from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  handleTodoDeleting: (id: number) => void;
  deletingId: number;
  isCompletedDeleting: boolean;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  handleTodoDeleting,
  deletingId,
  isCompletedDeleting,
}) => {
  const { completed, title, id } = todo;
  const isLoader = deletingId === id || (isCompletedDeleting && todo.completed);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        value={id}
        onClick={(event) => {
          handleTodoDeleting(+event.currentTarget.value);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isLoader,
          },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
