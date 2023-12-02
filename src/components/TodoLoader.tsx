import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoLoader: React.FC<Props> = ({ todo }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames(
        'modal', 'overlay', {
          'is-active': todo.id === 0,
        },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
