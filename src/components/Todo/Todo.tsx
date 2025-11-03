import React from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../../types/todo';
import '../../styles/todo.scss';

type Props = {
  todo: TodoType;
  onDeleteTodo: (id: number) => void;
  deletingIds: number[];
};

export const Todo: React.FC<Props> = ({ todo, onDeleteTodo, deletingIds }) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed === true })}
    >
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          ' is-active': deletingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
