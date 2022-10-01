import React from 'react';
import classNames from 'classnames';

type Props = {
  isActive?: boolean | false,
  selectedTodosId?: number[],
  id: number,
};

export const Loader: React.FC<Props> = ({
  isActive,
  selectedTodosId,
  id,
}) => (
  <div
    data-cy="TodoLoader"
    className={classNames(
      'modal overlay',
      { 'is-active': selectedTodosId?.includes(id) || isActive },
    )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
