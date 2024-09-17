import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  addTodoId: number | null;
}

export const TodoItem: React.FC<Props> = ({ todo, onDelete, addTodoId }) => {
  const { id, title, completed } = todo;

  const [isCompleted, setIsCompleted] = useState(completed);

  const isCompletedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCompleted(event.currentTarget.checked);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={isCompleted}
          onChange={isCompletedHandler}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': id === addTodoId,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
