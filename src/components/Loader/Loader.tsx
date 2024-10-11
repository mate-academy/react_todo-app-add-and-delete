import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface LoaderProps {
  loadingIds: number[];
  todo: Todo;
}

export const Loader: React.FC<LoaderProps> = ({ loadingIds, todo }) => (
  <div
    data-cy="TodoLoader"
    className={classNames('modal', 'overlay', {
      'is-active': loadingIds.includes(todo.id),
    })}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
