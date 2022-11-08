import cn from 'classnames';
import React from 'react';

interface Props {
  id: number;
  title: string;
  isCompleted: boolean;
  removeTodoFromServer: (todoToRemoveId: number) => void;
}

export const TodoItem: React.FC<Props> = React.memo(({
  id,
  title,
  isCompleted,
  removeTodoFromServer,
}) => (
  <div
    data-cy="Todo"
    className={cn('todo', {
      completed: isCompleted,
    })}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        defaultChecked
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDeleteButton"
      onClick={() => removeTodoFromServer(id)}
    >
      ×
    </button>

    <div data-cy="TodoLoader" className="modal overlay">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
));
