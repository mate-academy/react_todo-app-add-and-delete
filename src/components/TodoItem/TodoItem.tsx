import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
}) => {
  const { id, completed, title } = todo;
  const [deleting, setDeleting] = useState<number | null>(null);

  return (
    <div
      data-cy="Todo"
      className={`todo ${completed && 'completed'}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        { title }
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          removeTodo(id);
          setDeleting(id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          {
            'is-active': id === deleting,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
