import React from 'react';

export const Loader: React.FC = () => {
  return (
    // overlay will cover the todo while it is being deleted or updated
    <div data-cy="TodoLoader" className="modal overlay">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
