import classNames from 'classnames';
import React, { useContext } from 'react';
import { TodosContext } from '../../context/TodosContext';

interface Props {
  id: number;
}

export const TodoLoader: React.FC<Props> = ({ id }) => {
  const { deleteIds } = useContext(TodosContext);

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': deleteIds.includes(id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
