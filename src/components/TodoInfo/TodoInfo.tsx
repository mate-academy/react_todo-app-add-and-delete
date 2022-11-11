import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  deletedTodoIds: number[];
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  deletedTodoIds,
}) => {
  const {
    title,
    id,
    completed,
  } = todo;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDeleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': deletedTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
