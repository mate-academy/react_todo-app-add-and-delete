import classNames from 'classnames';
import React from 'react';
import { useAppState } from '../AppState/AppState';

interface TodoLoaderProps {
  loading?: boolean;
}

export const TodoLoader: React.FC<TodoLoaderProps> = ({ loading }) => {
  const {
    tempTodo,
  } = useAppState();

  const shouldShowLoader = loading && tempTodo !== null;

  return (
    <div
      data-cy="TodoLoader"
      className={
        classNames('modal overlay', {
          'is-active': shouldShowLoader,
        })
      }
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />

    </div>
  );
};
