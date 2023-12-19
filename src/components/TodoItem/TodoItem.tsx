import React from 'react';
import cn from 'classnames';

import type { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => Promise<number | void>;
  hasLoader: boolean;
}

export const TodoItem: React.FC<Props> = React.memo((props) => {
  const { todo, onDelete, hasLoader } = props;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => { }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        x
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': hasLoader },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
