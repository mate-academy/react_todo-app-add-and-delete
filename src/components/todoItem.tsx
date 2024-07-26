import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  loading: number[] | null;
  onPatch: (id: number, data: Partial<Todo>) => void;
  onDelete?: (id: number[]) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onPatch,
  onDelete = () => {},
}) => {
  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn('todo', 'item-enter-done', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onPatch(todo.id, { completed: !todo.completed })}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete([todo.id])}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
