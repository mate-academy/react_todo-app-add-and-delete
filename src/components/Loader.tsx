import React from 'react';
import classNames from 'classnames';

type Props = {
  id: number,
  isDeleting: boolean,
};

export const Loader: React.FC<Props> = ({ id, isDeleting }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames({
        modal: true,
        overlay: true,
        'is-active': isDeleting || id === 0,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
