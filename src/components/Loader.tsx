import cn from 'classnames';
import React, { useContext } from 'react';
import { StateContext } from '../managment/TodoContext';

type Props = {
  id: number;
};

export const Loader: React.FC<Props> = ({ id }) => {
  const { isLoading, currentTodosId } = useContext(StateContext);
  const showLoading = currentTodosId.includes(id);

  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': showLoading && isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
