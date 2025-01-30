import React from 'react';
import cn from 'classnames';

type Props = {
  id: number;
  loadingTodoId: number | null;
};

export const TodoLoader: React.FC<Props> = ({ id, loadingTodoId }) => (
  <div
    data-cy="TodoLoader"
    className={cn('modal overlay', {
      'is-active': loadingTodoId !== null || id === 0,
    })}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
