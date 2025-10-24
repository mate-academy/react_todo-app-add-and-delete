import React from 'react';
import cn from 'classnames';
import type { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isPending: boolean;
  onDelete: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, isPending, onDelete }) => {
  const isTemp = todo.id === 0;

  return (
    <div
      data-cy="Todo"
      className={cn('todo item-enter-done', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {!isTemp && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTemp || isPending,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
