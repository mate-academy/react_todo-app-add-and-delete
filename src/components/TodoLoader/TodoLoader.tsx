import classNames from 'classnames';
import React from 'react';

type Props = {
  isActive?: boolean;
};

export const TodoLoader: React.FC<Props> = ({ isActive }) => (
  <div
    data-cy="TodoLoader"
    className={classNames({
      'modal overlay': true,
      'is-active': isActive,
    })}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
