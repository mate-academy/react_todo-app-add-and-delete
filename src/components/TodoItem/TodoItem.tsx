import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  loading: boolean,
  deletedTodoId: number[],
  removeTodo: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo, removeTodo, deletedTodoId, loading,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      key={id}
      className={
        classNames('todo', { completed })
      }
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames('modal overlay', {
        'is-active': deletedTodoId.includes(id) || loading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
