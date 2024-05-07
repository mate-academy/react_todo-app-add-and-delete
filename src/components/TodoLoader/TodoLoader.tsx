import React from 'react';
import cn from 'classnames';

import { TodoLoaderType } from '../../types/TodoLoaderType';

export const TodoLoader: React.FC<TodoLoaderType> = ({ isLoading }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
