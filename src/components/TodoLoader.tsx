// components/TodoLoader.tsx
import React from 'react';
import classNames from 'classnames';

type TodoLoaderProps = {
  isActive: boolean;
};

export const TodoLoader: React.FC<TodoLoaderProps> = ({ isActive }) => {
  if (!isActive) {
    return null;
  }

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', { 'is-active': isActive })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
