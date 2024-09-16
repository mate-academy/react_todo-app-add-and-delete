import React from 'react';
import cn from 'classnames';

type Props = {
  isActive: boolean;
};

export const TodoItemLoader: React.FC<Props> = ({ isActive }) => (
  <div
    data-cy="TodoLoader"
    className={cn('modal', 'overlay', { 'is-active': isActive })}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
