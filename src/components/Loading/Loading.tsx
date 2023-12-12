import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div data-cy="TodoLoader" className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
