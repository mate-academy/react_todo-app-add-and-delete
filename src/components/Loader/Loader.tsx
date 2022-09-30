import React from 'react';
import classNames from 'classnames';

type Props = {
  isActive?: boolean | false,
  selectedTodoId?: number | null,
  id?: number,
};

export const Loader: React.FC<Props> = ({
  isActive,
  selectedTodoId,
  id,
}) => (
  <div
    data-cy="TodoLoader"
    className={classNames(
      'modal overlay',
      { 'is-active': isActive },
      { 'is-active': selectedTodoId === id },
    )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
