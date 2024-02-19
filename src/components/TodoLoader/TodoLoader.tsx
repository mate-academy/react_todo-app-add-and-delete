import React from 'react';
import cn from 'classnames';

type Props = {
  itemLoading: boolean,
};

export const TodoLoader: React.FC<Props> = ({ itemLoading }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': itemLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
