import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  tempTodo: Todo;
  loadingTodoIds: number[];
}

export const TodoTemp: React.FC<Props> = ({ loadingTodoIds, tempTodo }) => {
  return (
    <div data-cy="Todo" className="todo">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title}
      </span>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoIds.includes(0),
        })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
