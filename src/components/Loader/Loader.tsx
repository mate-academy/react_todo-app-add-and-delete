import classNames from 'classnames';
import React from 'react';

type Props = {
  isLoader: boolean;
};

export const Loader: React.FC<Props> = ({ isLoader }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', { 'is-active': isLoader })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
