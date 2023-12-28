import React from 'react';

export const Loader: React.FC = () => {
  return (
    // {/* overlay will cover the todo while it is being update  d */}
    <div data-cy="TodoLoader" className="modal overlay is-active">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
