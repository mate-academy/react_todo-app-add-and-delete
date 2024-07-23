import React from 'react';

export const Loader: React.FC = () => (
  <div className="modal overlay is-active">
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
