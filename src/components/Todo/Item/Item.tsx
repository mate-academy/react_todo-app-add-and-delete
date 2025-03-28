/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../../types/Todo';
import classNames from 'classnames';
import { TodoRemoveHandler } from '../../../types/TodoMethods';

type Props = {
  todo: Todo;
  onRemove: TodoRemoveHandler;
  isLoading: boolean;
};
export const TodoItem: React.FC<Props> = React.memo(
  ({ todo, isLoading, onRemove }) => {
    return (
      <div
        data-cy="Todo"
        className={classNames('todo', {
          completed: todo.completed,
        })}
        key={todo.id}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onRemove(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
