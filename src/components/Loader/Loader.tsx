import classNames from 'classnames';
import React from 'react';

interface Props {
  isAdding?: boolean;
  isDeleting?: boolean;
  id?: number;
  deletingTodoIds?: number[];
}

export const Loader: React.FC<Props> = ({
  isAdding,
  isDeleting,
  deletingTodoIds,
  id,
}) => (
  <div
    data-cy="TodoLoader"
    className={classNames(
      'modal overlay',
      {
        'is-active': isAdding || (deletingTodoIds.includes(id) && isDeleting),
      },
    )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
