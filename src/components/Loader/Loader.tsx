import classNames from 'classnames';
import React from 'react';

type Props = {
  isActive: boolean,
};

export const Loader: React.FC<Props> = ({ isActive }) => {
  return (
    <div
      className={classNames(
        'modal overlay',
        { 'is-active': isActive },
      )}
      aria-label="Loader"
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
