import classNames from 'classnames';
import React from 'react';

interface Props {
  isAdding?: boolean;
  id?: number;
  ids?: number[];
}

export const Loader: React.FC<Props> = ({ isAdding, id, ids }) => {
  let checkIsActive;

  if (id && ids) {
    checkIsActive = ids.includes(id);
  }

  return (
    <div
      data-cy="TodoLoader"
      className={classNames(
        'modal',
        'overlay',
        {
          'is-active': isAdding || checkIsActive,
        },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
