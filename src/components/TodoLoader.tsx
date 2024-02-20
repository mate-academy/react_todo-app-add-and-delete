import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../contexts/TodoContext';

type Props = {
  id: number;
};

export const TodoLoader: React.FC<Props> = ({ id }) => {
  const { updatingTodosIds } = useContext(TodoContext);

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': updatingTodosIds.includes(id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
