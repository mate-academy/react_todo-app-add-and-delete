import classNames from 'classnames';
import React from 'react';

type Props = {
  isActive?: boolean;
};

export const Loader: React.FC<Props> = ({ isActive }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isActive,
      })}
    >
      <div className="modal-background has background-white-ter"></div>
      <div className="loader" />
    </div>
  );
};
