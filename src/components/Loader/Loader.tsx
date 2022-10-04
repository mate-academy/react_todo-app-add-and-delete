import React from 'react';

export const loader: React.FC = () => {
  return (
    <div data-cy="TodoLoader" className="modal overlay">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
