import cn from 'classnames';
import React from 'react';

type Props = {
  isLoading: number[];
  id: number;
};

export const Loader: React.FC<Props> = ({ isLoading, id }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isLoading.includes(id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
