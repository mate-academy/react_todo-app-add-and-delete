/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/todo';
import { TodoDeleteButton } from '../TodoDeleteButton';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isCompletedDeleting: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isCompletedDeleting,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setIsDeleting(false);
    }
  };

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
          disabled
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <TodoDeleteButton onDelete={handleDelete} todoId={todo.id} />

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isCompletedDeleting || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
