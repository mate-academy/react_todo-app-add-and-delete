import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDelete?: (id: number) => void,
  isLoading: boolean,
  loadingId: null | number,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  isLoading,
  loadingId,
}) => {
  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoading && loadingId === todo.id,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
