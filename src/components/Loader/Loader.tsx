import React from 'react';

export const Loader:React.FC = () => (
  <div data-cy="TodoLoader" className="modal overlay">
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
