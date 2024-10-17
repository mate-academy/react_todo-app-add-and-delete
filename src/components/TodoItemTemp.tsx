/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo | null;
  isAddingTodo: boolean;
};

export const TodoItemTemp: FC<Props> = ({ tempTodo, isAddingTodo }) => (
  <div data-cy="Todo" className="todo">
    <label className="todo__status-label">
      <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {tempTodo?.title}
    </span>

    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', { 'is-active': isAddingTodo })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
