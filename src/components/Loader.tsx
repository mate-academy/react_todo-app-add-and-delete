import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo?: Todo | null;
  isLoading?: boolean;
};

export const Loader: React.FC<Props> = ({ tempTodo, isLoading = false }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': tempTodo || isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
