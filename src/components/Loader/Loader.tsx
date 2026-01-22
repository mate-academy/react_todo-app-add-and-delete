import React from 'react';
import classNames from 'classnames';

type Props = {
  isLoaderOn?: boolean;
};

export const Loader: React.FC<Props> = ({ isLoaderOn }) => (
  <div
    data-cy="TodoLoader"
    className={classNames('modal overlay', {
      'is-active': isLoaderOn,
    })}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
