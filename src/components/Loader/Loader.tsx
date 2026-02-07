import React from 'react';
import classNames from 'classnames';

interface Props {
  isLoading: boolean;
}

export const Loader: React.FC<Props> = ({ isLoading }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
