import React from 'react';

type Props = {
  isActive: boolean;
};

export const TodoLoader: React.FC<Props> = ({ isActive }) => {
  const activeClass = isActive ? 'is-active' : '';

  return (
    <div data-cy="TodoLoader" className={`modal overlay ${activeClass}`}>
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
