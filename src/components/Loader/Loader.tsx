import classNames from 'classnames';
import React from 'react';

type Props = {
  isTemp: boolean;
};

export const Loader: React.FC<Props> = ({ isTemp }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal', 'overlay', {
        'is-active': isTemp,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
