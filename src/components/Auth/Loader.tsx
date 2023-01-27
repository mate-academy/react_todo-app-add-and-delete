import React from 'react';
import cn from 'classnames';

type Props = {
  isDelete: number[];
  todoId: number;
};

export const Loader: React.FC<Props> = ({ isDelete, todoId }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', { 'is-active': isDelete || todoId === 0 })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
