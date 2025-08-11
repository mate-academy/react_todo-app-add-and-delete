import classNames from 'classnames';
import React from 'react';

type Props = {
  todoId: number;
  updatingTodoIds: number[];
};

export const Loader: React.FC<Props> = ({ todoId, updatingTodoIds }) => {
  const isUpdating = updatingTodoIds.includes(todoId);

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isUpdating,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
