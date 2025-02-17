/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  handleCompltete(id: number): void;
  loadingIds: number[];
  handleDelete(id: number): void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleCompltete,
  loadingIds,
  handleDelete,
}) => (
  <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={() => {
          handleCompltete(todo.id);
        }}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => handleDelete(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': loadingIds.includes(todo.id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
