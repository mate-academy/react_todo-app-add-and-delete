import React from 'react';
import cn from 'classnames';

interface LoaderProps {
  showLoader: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ showLoader }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', { 'is-active': showLoader })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
