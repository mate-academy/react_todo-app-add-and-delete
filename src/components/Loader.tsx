import React, { useContext } from 'react';
import classNames from 'classnames';
import { StateContext } from '../management/TodoContext';

type Props = {
  id: number;
};

export const Loader: React.FC<Props> = ({ id }) => {
  const { isLoading, currentTodosId } = useContext(StateContext);

  const showLoader = currentTodosId.includes(id);

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isLoading && showLoader,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
