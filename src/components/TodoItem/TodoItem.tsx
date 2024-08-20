import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => (
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
  >
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
    <label className="todo__status-label" htmlFor={`input-${todo.id}`}>
      <input
        id={`input-${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
      />
    </label>
    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>
    {/* Remove button appears only on hover */}
    <button type="button" className="todo__remove" data-cy="TodoDelete">
      ×
    </button>
    {/* overlay will cover the todo while it is being deleted or updated */}
    <div data-cy="TodoLoader" className="modal overlay">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
