import React from 'react';
import cn from 'classnames';

type Props = {
  loading: boolean;
};

export const Loader: React.FC<Props> = ({ loading }) => {
  return (
    <>
      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};
