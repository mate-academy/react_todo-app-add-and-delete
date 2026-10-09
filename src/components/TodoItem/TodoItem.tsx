/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading, onDelete }) => (
  <div
    data-cy="Todo"
    className={classNames('todo', {
      completed: todo.completed,
    })}
  >
    <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        className="todo__status"
        data-cy="TodoStatus"
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
      onClick={() => onDelete(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('loader', {
        'is-active': isLoading,
      })}
    />
  </div>
);
