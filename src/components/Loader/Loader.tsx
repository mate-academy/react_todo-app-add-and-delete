import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useState } from 'react';

type LoaderProps = {
  activeTodo?: Todo[];
  todoId?: Todo['id'];
};

export const Loader: React.FC<LoaderProps> = ({ activeTodo, todoId }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (todoId === 0) {
      setIsLoading(true);
    }

    if (activeTodo?.some(item => item.id === todoId)) {
      setIsLoading(true);
    }
  }, [todoId, activeTodo]);

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
