import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo?: Todo;
  tempTodo?: Todo;
  onDeletedTodo: (id: number) => Promise<void>;
  deletedTodosId?: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  tempTodo,
  onDeletedTodo,
  deletedTodosId,
}) => {
  return (
    //{/* This is a completed todo */}
    <div
      data-cy="Todo"
      className={classNames('todo', todo?.completed ? 'completed' : '')}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo?.completed}
        />
      </label>
      {/* eslint-enable jsx-a11y/label-has-associated-control */}
      <span data-cy="TodoTitle" className="todo__title">
        {todo?.title || tempTodo?.title}
      </span>
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeletedTodo(todo!.id)}
      >
        ×
      </button>
      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': Boolean(
            tempTodo || deletedTodosId?.includes(todo?.id ?? -1),
          ),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
