import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo | null;
  onSelect: (todoId: number) => void;
  updated: (todo: Todo) => void;
  isLoading?: boolean;
}

export const Todofile: React.FC<Props> = ({
  todo = null,
  onSelect,
  updated,
  isLoading = false,
}) => {
  const isItemLoading = todo ? todo.id === 0 || isLoading : false;

  if (!todo) {
    return null;
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label
        className="todo__status-label"
        onClick={() => {
          updated({
            ...todo,
            completed: !todo.completed,
          });
        }}
      >
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
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onSelect(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isItemLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
