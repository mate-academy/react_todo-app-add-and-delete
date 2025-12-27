import React from 'react';
import classNames from 'classnames';
import './Loader.scss';

type Props = {
  isActive: boolean;
};

export const Loader: React.FC<Props> = ({ isActive }) => (
  <div
    data-cy="TodoLoader"
    className={classNames('Loader', { 'is-active': isActive })}
  >
    <div className="Loader__content" />
  </div>
);
