import cn from 'classnames';
import React from 'react';

type Props = {
  loading: number[];
  id: number;
};

export const Loader: React.FC<Props> = ({ loading, id }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': loading.includes(id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
