import React from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isShowLoader: boolean;
  onDelete?: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, isShowLoader, onDelete }) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label aria-label="Todo status" className="todo__status-label">
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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          if (onDelete) {
            onDelete(todo.id);
          }
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isShowLoader })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
