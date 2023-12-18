import React from 'react';
import cn from 'classnames';

import type { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = React.memo(({ todo }) => {
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
      >
        x
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': !todo.id })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
});
