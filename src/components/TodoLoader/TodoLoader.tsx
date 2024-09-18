import classNames from 'classnames';
import React from 'react';

interface Props {
  isSubmitting: boolean;
}

export const TodoLoader: React.FC<Props> = ({ isSubmitting }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isSubmitting,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
