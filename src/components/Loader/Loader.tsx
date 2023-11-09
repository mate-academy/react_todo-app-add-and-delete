import React from 'react';

export const Loader
: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  return (
    <div data-cy="TodoLoader" className={`modal overlay ${isActive && 'is-active'}`}>
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
